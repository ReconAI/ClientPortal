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
from stripe.error import CardError

from shared.managers import PaymentMethodManager


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
    def __init__(self, price: PriceInterface, tax: float):
        """
        :type price: Price
        :type tax: float
        """
        super().__init__(price)

        self.__tax = tax

    def as_price(self) -> float:
        """
        :rtype: float
        """
        return self._price.as_price() * (100 + self.__tax) / 100

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


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

    def __init__(self, user: 'User'):
        """
        :type user: User
        """
        self.__user = user
        self.__cloud_cost = Decimal(0)
        self.license_fee = Decimal(settings.USER_LICENSE_FEE)

    @property
    def cloud_cost(self) -> Union[Decimal, float]:
        """
        :rtype: Union[Decimal, float]
        """
        return PriceWithTax(Price(self.__cloud_cost), 10).as_price()

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

    def __init__(self, users: List['User'], devices_cnt: int = 0):
        """
        :type users: List['User']
        :type devices_cnt: int
        """
        self.__users = users
        self.__devices_license_fee = Decimal(settings.DEVICE_LICENSE_FEE)
        self.devices_cnt = Decimal(devices_cnt)

    @property
    def license_fee(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return functools.reduce(
            lambda carry, user: carry + UserCostHandler(user).license_fee,
            self.__users,
            Decimal(0)
        )

    @property
    def cloud_cost(self) -> Decimal:
        """
        :rtype: Decimal
        """
        return functools.reduce(
            lambda carry, user: carry + UserCostHandler(user).cloud_cost,
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

    def __init__(self, organization: 'Organization',
                 last_payment_id: Optional[str] = None,
                 last_payment_dt: Optional[datetime] = None):
        """
        :type organization: Organization
        :param last_payment_id: Optional[str]
        :param last_payment_dt: Optional[datetime]
        """
        self.__organization = organization
        self.__last_payment_id = last_payment_id
        self.__last_payment_dt = last_payment_dt

    def charge(self, amount: int) -> Optional[str]:
        """
        :rtype: str
        """
        try:
            payment = self.__organization.customer.pay(
                amount=amount,
                payment_method=self.__organization_payment_method,
                confirm=True
            )
            return payment.id
        except (IndexError, AttributeError, CardError):
            return None

    @property
    def is_to_be_charged(self) -> bool:
        """
        :rtype: bool
        """
        if self.__last_payment_id:
            return (
                self.__last_payment_dt
                + timedelta(days=settings.CHARGE_EACH_N_DAYS)
            ) < now()

        return self.__last_payment_dt is None

    # todo change to default one selection
    @property
    def __organization_payment_method(self) -> str:
        """
        :rtype: str
        """
        payment_methods = self.__organization.customer.payment_methods().list(
            PaymentMethodManager.CARD_METHOD
        )

        return payment_methods.get('data', [])[0].id
