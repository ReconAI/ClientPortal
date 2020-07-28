"""
Module with project helpers
"""


class Price:
    """
    Price value object
    """

    def __init__(self, price: float):
        """
        :type price: float
        """
        self.__price = price

    def as_price(self) -> float:
        """
        :rtype: float
        """
        return self.__price

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


class PriceWithTax:
    """
    Price with taxes value object
    """
    def __init__(self, price: Price, tax: float):
        """
        :type price: Price
        :type tax: float
        """
        self.__price = price
        self.__tax = tax

    def as_price(self) -> float:
        """
        :rtype: float
        """
        return self.__price.as_price() * (100 + self.__tax) / 100

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return self.as_price() * items_cnt


class StripePrice:
    """
    Stripe price value object
    """

    def __init__(self, price: Price):
        """
        :type price: Price
        """
        self.__price = price

    def as_price(self):
        """
        :rtype: float
        """
        return self.__price.as_price()

    def total(self, items_cnt: int) -> float:
        """
        :rtype: float
        """
        return round(self.as_price() * items_cnt * 100)
