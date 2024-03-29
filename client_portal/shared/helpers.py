"""
Module with project helpers
"""
import functools
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from decimal import Decimal
from typing import List, Union, Optional

from django.conf import settings
from django.utils.timezone import now
from stripe.error import CardError, InvalidRequestError


class PriceInterface(ABC):
    """
    Price value interface
    """

    @abstractmethod
    def as_price(self) -> Union[float, Decimal]:
        """
        :rtype: float
        """

    @abstractmethod
    def total(self, items_cnt: int) -> Union[float, Decimal]:
        """
        :rtype: float
        """


class Price(PriceInterface):
    """
    Price value object
    """

    def __init__(self, price: Union[float, Decimal]):
        """
        :type price: float
        """
        self.__price = price

    def as_price(self) -> Union[float, Decimal]:
        """
        :rtype: float
        """
        return self.__price

    def total(self, items_cnt: int) -> Union[float, Decimal]:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


class PriceDecorator(PriceInterface):
    """
    Price interface decorator
    """

    def __init__(self, price: PriceInterface):
        """
        :type price: PriceInterface
        """
        self._price = price


class PriceWithTax(PriceDecorator):
    """
    Price with taxes value object
    """
    def __init__(self, price: PriceInterface, tax: Union[Decimal, float]):
        """
        :type price: Price
        :type tax: float
        """
        super().__init__(price)

        self._tax = tax

    def as_price(self) -> float:
        """
        :rtype: float
        """
        return self._price.as_price() * (100 + self._tax) / 100

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


class PriceWithoutTax(PriceWithTax):
    """
    Deduct price from the initial value
    """
    def as_price(self) -> float:
        """
        :rtype: float
        """
        return self._price.as_price() / (
            (100 + self._tax) / 100
        )


class StripePrice(PriceDecorator):
    """
    Stripe price value object
    """

    def as_price(self):
        """
        :rtype: float
        """
        return round(self._price.as_price() * 100)

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


class UserCostHandler:
    """
    Calculates how much user owes for period passed
    """

    def __init__(self, user: 'User',
                 user_license_fee: float):
        """
        :type user: User
        :type user_license_fee: float
        """
        self.__user = user
        self.license_fee = Decimal(user_license_fee)
        self.__cloud_cost = Decimal(settings.INFRASTRUCTURE_USAGE_FEE)
        self.__cloud_tax = Decimal(settings.INFRASTRUCTURE_USAGE_TAX)

    @property
    def cloud_cost(self) -> Union[Decimal, float]:
        """
        :rtype: Union[Decimal, float]
        """
        return PriceWithTax(
            Price(self.__cloud_cost),
            self.__cloud_tax
        ).as_price()

    @property
    def total(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return self.cloud_cost + self.license_fee


class MonthlyUsageCalculator:
    """
    Calculates how much company owes for period passed
    """

    def __init__(self, users: List['User'],
                 device_license_fee: float,
                 user_license_fee: float,
                 devices_cnt: int = 0):
        """
        :type users: List['User']
        :type device_license_fee: float
        :type user_license_fee: float
        :type devices_cnt: int
        """
        self.__users = users
        self.__devices_license_fee = Decimal(device_license_fee)
        self.__user_license_fee = user_license_fee
        self.devices_cnt = Decimal(devices_cnt)

    @property
    def license_fee(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return functools.reduce(
            lambda carry, user: carry + UserCostHandler(
                user,
                self.__user_license_fee
            ).license_fee,
            self.__users,
            Decimal(0)
        )

    @property
    def cloud_cost(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return functools.reduce(
            lambda carry, user: carry + UserCostHandler(
                user,
                self.__user_license_fee
            ).cloud_cost,
            self.__users,
            Decimal(0)
        )

    @property
    def device_fee(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return self.devices_cnt * self.__devices_license_fee

    @property
    def users_total(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return self.cloud_cost + self.license_fee

    @property
    def total(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return self.users_total + self.device_fee


class OrganizationCharger:
    """
    Responsible for company charge logic
    """

    def __init__(self, organization: 'Organization'):
        """
        :type organization: Organization
        """
        self.__organization = organization

    # todo change to default one selection
    @property
    def _organization_payment_method(self) -> str:
        """
        :rtype: str
        """
        payment_methods = self.__organization.customer. \
            payment_methods().cards()

        return payment_methods.get('data', [])[0].id

    def charge(self, amount: float) -> Optional[str]:
        if self.is_invoice:
            return None

        return self.__organization.customer.pay(
            amount=amount,
            payment_method=self._organization_payment_method,
            confirm=True
        ).id

    @property
    def is_invoice(self) -> bool:
        """
        Checks whether payment should be completed by invoice

        :rtype: bool
        """
        return self.__organization.is_invoice_payment_method


class RecurrentCharger(OrganizationCharger):
    """
        Responsible for company charge logic
        """

    def __init__(self, organization: 'Organization',
                 last_payment_id: Optional[str] = None,
                 last_payment_dt: Optional[datetime] = None,
                 is_invoice: bool = False
                 ):
        """
        :type organization: Organization
        :type last_payment_id: Optional[str]
        :type last_payment_dt: Optional[datetime]
        :type is_invoice: bool
        """
        super().__init__(organization)

        self.__last_payment_id = last_payment_id
        self.__last_payment_dt = last_payment_dt
        self.__is_invoice = is_invoice

    def charge(self, amount: float) -> Optional[str]:
        """
        :type amount: float

        :rtype: Optional[str]
        """
        try:
            return super().charge(amount)
        except (IndexError, AttributeError, CardError, InvalidRequestError):
            return None

    @property
    def is_to_be_charged(self) -> bool:
        """
        :rtype: bool
        """
        if self.__last_payment_id or self.__is_invoice:
            return (
                self.__last_payment_dt
                + timedelta(days=settings.CHARGE_EACH_N_DAYS)
            ) < now()

        return self.__last_payment_dt is None

    @property
    def user_license_fee(self) -> float:
        """
        :rtype: float
        """
        return self.__fee_if_first_payment(settings.USER_LICENSE_FEE)

    @property
    def device_license_fee(self) -> float:
        """
        :rtype: float
        """
        return self.__fee_if_first_payment(settings.DEVICE_LICENSE_FEE)

    def __fee_if_first_payment(self, dimension: float) -> float:
        """
        :rtype: float
        """
        if self.__last_payment_dt is not None:
            return dimension

        return .0


class PurchaseCharger(OrganizationCharger):
    """
    Logic for charge for purchase is enclosed within the class
    """
    def __init__(self, organization: 'Organization',
                 card_id: Optional[str] = None,
                 is_invoice: bool = False
                 ):
        """
        :type organization: Organization
        :type is_invoice: bool
        """
        super().__init__(organization)

        self.__card_id = card_id
        self.__is_invoice = is_invoice

    @property
    def is_invoice(self) -> bool:
        return self.__is_invoice

    @property
    def _organization_payment_method(self) -> Optional[str]:
        """
        :rtype: str
        """
        return self.__card_id
