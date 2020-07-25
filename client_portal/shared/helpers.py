class Price:
    def __init__(self, price: float):
        self.__price = price

    def as_price(self) -> float:
        return self.__price

    def total(self, items_cnt: int) -> float:
        return self.as_price() * items_cnt


class PriceWithTax:
    def __init__(self, price: Price, tax: float):
        self.__price = price
        self.__tax = tax

    def as_price(self) -> float:
        return self.__price.as_price() * (100 + self.__tax) / 100

    def total(self, items_cnt: int) -> float:
        return self.as_price() * items_cnt


class StripePrice:
    def __init__(self, price: Price):
        self.__price = price

    def as_price(self):
        return self.__price.as_price()

    def total(self, items_cnt: int) -> float:
        return round(self.as_price() * items_cnt * 100)
