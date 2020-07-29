"""
Defines managers to manipulate data form diverse sources
"""

from abc import abstractmethod, ABC
from typing import Dict, List, Iterable

import boto3
import stripe
from django.conf import settings
from django.contrib.auth.models import UserManager as UserManagerBase, Group
from django.utils.module_loading import import_string
from stripe.error import InvalidRequestError


class UserManager(UserManagerBase):
    """
    User's manager
    """

    def __create(self, organization: 'Organization',
                 role: str, **extra_fields):
        """
        :type organization: Organization
        :type role: str
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundExcelption
        """
        from .models import UserGroup

        user = self._create_user(organization=organization, **extra_fields)

        super_admin_group = Group.objects.get(name=role)
        UserGroup.objects.create(user_id=user.id, group=super_admin_group)

        return user

    def create_admin(self, organization: 'Organization', **extra_fields):
        """
        :type organization: Organization

        :rtype: User
        """
        from .models import Role

        return self.__create(organization, Role.ADMIN, **extra_fields)

    def create_developer(self, organization: 'Organization', **extra_fields):
        """
        :type organization: Organization
        :type extra_fields: dict

        :rtype: User
        """
        from .models import Role

        return self.__create(organization, Role.DEVELOPER, **extra_fields)

    def create_client(self, organization: 'Organization', **extra_fields):
        """
        :type organization: Organization
        :type extra_fields: dict

        :rtype: User
        """
        from .models import Role

        return self.__create(organization, Role.CLIENT, **extra_fields)

    def create_superuser(self, **extra_fields):
        """
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundException
        """
        from .models import Role, Organization

        extra_fields.update({
            'is_active': True
        })

        return self.__create(Organization.root(), Role.SUPER_ADMIN,
                             **extra_fields)


class AbstractIaMUserManager:
    """
    Interface for user iam manager
    """

    def __init__(self, instance: 'User'):
        """
        :type instance: User
        """
        self._instance = instance

    @abstractmethod
    def get(self):
        """
        Gets user from the service
        """

    @abstractmethod
    def create(self):
        """
        Creates a user within IaM
        """

    @abstractmethod
    def update(self):
        """
        Updates a user within IaM
        """

    @abstractmethod
    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """

    @abstractmethod
    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """

    @abstractmethod
    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """


class IaMUserManager(AbstractIaMUserManager):
    """
    Manages data from IaM service
    """
    __user_serializer = 'shared.serializers.UserSerializer'

    def __init__(self, instance: 'User'):
        """
        :type instance: User
        """
        super().__init__(instance)

        self.__iam = boto3. \
            client('iam', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    def get(self):
        """
        Gets user from the service

        :type: str
        """
        return self.__iam.get_user(UserName=self._instance.username)

    def create(self):
        """
        Creates a user within IaM
        """
        self.__iam.create_user(UserName=self._instance.username,
                               Tags=self.__tags)
        self.add_user_to_group(settings.AWS_IAM_USER_GROUP)

    def update(self):
        """
        Updates a user within IaM
        """
        try:
            user = self.get()
            self.__iam.tag_user(UserName=self._instance.username,
                                Tags=self.__tags)
            return user
        except self.__iam.exceptions.NoSuchEntityException:
            return self.create()

    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """
        try:
            self.remove_user_from_group(settings.AWS_IAM_USER_GROUP)
            return self.__iam.delete_user(UserName=self._instance.username)
        except self.__iam.exceptions.NoSuchEntityException:
            return True

    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """
        return self.__iam.add_user_to_group(
            UserName=self._instance.username,
            GroupName=group_name
        )

    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """
        return self.__iam.remove_user_from_group(
            UserName=self._instance.username,
            GroupName=group_name
        )

    @property
    def __tags(self) -> List[Dict]:
        """
        Translates kwargs to user tags

        :rtype: List[Dict]
        """
        exclude = ['username']
        data = import_string(self.__user_serializer)(self._instance).data

        return [
            {'Key': key, 'Value': str(value)}
            for key, value
            in data
            if key not in exclude
        ]


class DummyIaMUserManager(AbstractIaMUserManager):
    """
    Implementation of dummy iam user manager.
    Doesn't send anything. Use it within local/testing environment.
    """

    def get(self):
        """
        Gets user from the service
        """

    def create(self):
        """
        Creates a user within IaM
        """

    def update(self):
        """
        Updates a user within IaM
        """

    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """

    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """

    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """


class AbstractPaymentMethodManager(ABC):
    """
    Abstract payment method manager
    """

    def __init__(self, customer: stripe.Customer):
        """
        :type customer: stripe.Customer
        """
        self._customer = customer

    def attach(self, method_id: str) -> object:
        """
        :type method_id: str

        :rtype: object
        """

    def detach(self, method_id: str) -> object:
        """
        :type method_id: str

        :rtype: object
        """

    def list(self, method_type: str) -> Iterable[object]:
        """
        :type method_type: str

        :rtype: Iterable[object]
        """


class AbstractCustomerManager(ABC):
    """
    Abstract customer manager
    """

    def __init__(self, organization: 'Organization'):
        """
        :type organization: Organization
        """
        self._organization = organization

    @abstractmethod
    def retrieve(self) -> object:
        """
        :rtype: object
        """

    @abstractmethod
    def create(self) -> object:
        """
        :rtype: object
        """

    @abstractmethod
    def delete(self) -> Iterable[object]:
        """
        :rtype: Iterable[object]
        """

    @abstractmethod
    def payment_methods(self) -> AbstractPaymentMethodManager:
        """
        :rtype: AbstractPaymentMethodManager
        """

    @abstractmethod
    def pay(self, amount: float, payment_method: str, **kwargs) -> object:
        """
        Performs payment on behalf of the customer

        :type amount: float
        :type payment_method: str

        :rtype: object
        """

    def retrieve_or_create(self) -> object:
        """
        :rtype: object
        """
        customer = self.retrieve()

        if customer:
            return customer

        return self.create()


class PaymentMethodManager(AbstractPaymentMethodManager):
    """
    Payment method manager
    """

    __source = stripe.PaymentMethod

    CARD_METHOD = 'card'

    def list(self, method_type: str, **params) -> stripe.ListObject:
        """
        :type method_type: str

        :rtype: stripe.ListObject
        """
        return self.__source.list(
            customer=self._customer.id,
            type=method_type,
            api_key=settings.STRIPE_SECRET_KEY,
            **params
        )

    def attach(self, method_id: str) -> stripe.PaymentMethod:
        """
        :type method_id: str

        :rtype: stripe.PaymentMethod
        """
        return self.__source.attach(
            method_id,
            customer=self._customer.id,
            api_key=settings.STRIPE_SECRET_KEY
        )

    def detach(self, method_id: str) -> stripe.PaymentMethod:
        """
        :type method_id: str

        :rtype: stripe.PaymentMethod
        """
        return self.__source.detach(
            method_id,
            api_key=settings.STRIPE_SECRET_KEY
        )


class StripeCustomerManager(AbstractCustomerManager):
    """
    Stripe method manager
    """

    __source = stripe.Customer

    def retrieve(self) -> stripe.Customer:
        """
        :rtype: stripe.Customer
        """
        return self.__source.retrieve(
            str(self._organization.id),
            api_key=settings.STRIPE_SECRET_KEY
        )

    def create(self) -> stripe.Customer:
        """
        :rtype: stripe.Customer
        """
        return self.__source.create(
            id=str(self._organization.id),
            name=self._organization.name,
            api_key=settings.STRIPE_SECRET_KEY
        )

    def delete(self) -> stripe.Customer:
        """
        :rtype: stripe.Customer
        """
        return self.__source.delete(
            str(self._organization.id),
            api_key=settings.STRIPE_SECRET_KEY
        )

    def payment_methods(self) -> AbstractPaymentMethodManager:
        """
        :rtype: AbstractPaymentMethodManager
        """
        return PaymentMethodManager(
            self.retrieve_or_create()
        )

    def pay(self, amount: float, payment_method: str, **kwargs) -> object:
        return stripe.PaymentIntent.create(
            amount=amount,
            customer=self._organization.id,
            receipt_email=self._organization.inv_email,
            payment_method=payment_method,
            currency=settings.CURRENCY,
            api_key=settings.STRIPE_SECRET_KEY,
            **kwargs
        )

    def retrieve_or_create(self) -> stripe.Customer:
        """
        :rtype: stripe.Customer
        """
        try:
            return self.retrieve()
        except InvalidRequestError:
            return self.create()
