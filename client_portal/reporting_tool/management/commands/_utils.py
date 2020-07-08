import random
from copy import copy
from logging import warn
from typing import List, Dict, Type, Union, Callable

from django.db.models import OneToOneField, ForeignKey, Model
from django.utils.module_loading import import_string
from django_seed.exceptions import SeederException
from django_seed.seeder import Seeder as BaseSeeder, \
    ModelSeeder as BaseModelSeeder


class Inserted:
    """
    Manipulates with already inserted records
    """
    def __init__(self, field: ForeignKey, related_model: Type[Model]):
        """
        :type field: ForeignKey
        :type related_model: Type[Model]
        """
        self.__ids_list = None
        self.__field = field
        self.__related_model = related_model

    def __invoke__(self, ids_list: Dict[type, List[int]]) -> int:
        """
        Inserts given inserted rows for the first time and pop them out
        each time seeder accesses them.

        :type ids_list: Dict[type, List[int]]

        :rtype: int

        :raise: SeederException
        """
        if self.__related_model in ids_list and ids_list[self.__related_model]:
            self.set_ids_list(ids_list[self.__related_model])

            return self.__related_model.objects.get(pk=self.__ids_list.pop())
        else:
            message = 'Field {} cannot be null'.format(self.__field)
            raise SeederException(message)

    def __call__(self, ids_list: List[int]) -> int:
        """
        :type ids_list: List[int]

        :rtype: int
        """
        return self.__invoke__(ids_list)

    def set_ids_list(self, ids_list: List[int]):
        """
        Set ids_list for the first time and shuffles them

        :type ids_list: List[int]
        """
        if self.__ids_list is None:
            self.__ids_list = copy(ids_list)
            random.shuffle(self.__ids_list)


class ModelSeeder(BaseModelSeeder):
    """
    Apply Inserted rather than relation for OneToOneField to get out
    foreign key integrity error
    """
    @staticmethod
    def build_relation(field: ForeignKey,
                       related_model: Type[Model]) -> Union[Callable]:
        """
        :type field: ForeignKey
        :type related_model: Type[Model]

        :rtype: Union[Callable]
        """
        if isinstance(field, (OneToOneField,)):
            return Inserted(field, related_model)

        return BaseModelSeeder.build_relation(field, related_model)


class Seeder(BaseSeeder):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._take_all_existent = []

    def set_take_all_existent(self, take_all_existent):
        for take_all_existent_class in take_all_existent:
            try:
                self._take_all_existent.append(
                    import_string(take_all_existent_class)
                )
            except ImportError:
                warn('No such class {}'.format(take_all_existent_class))

    def add_entity(self, model: Type[Model], number, customFieldFormatters=None):
        """
        Swaps initial seeder by custom one

        :type model: Type[Model]
        :param number:
        :param customFieldFormatters:
        :return:
        """
        if not isinstance(model, ModelSeeder):
            model = ModelSeeder(model)

        model.field_formatters = model.guess_field_formatters(self.faker)
        if customFieldFormatters:
            model.field_formatters.update(customFieldFormatters)

        klass = model.model
        self.entities[klass] = model
        self.quantities[klass] = number
        self.orders.append(klass)

    def execute(self, using=None):
        """
        Populate the database using all the Entity classes previously added.

        :param using A Django database connection name
        :rtype: A list of the inserted PKs
        """
        if not using:
            using = self.get_connection()

        inserted_entities = {}
        for klass in self.orders:
            if klass in self._take_all_existent:
                inserted_entities[klass] = list(
                    klass.objects.values_list(klass._meta.pk.name, flat=True)
                )
                continue

            number = self.quantities[klass]
            if klass not in inserted_entities:
                inserted_entities[klass] = []
            for i in range(0, number):
                entity = self.entities[klass].execute(using, inserted_entities)
                inserted_entities[klass].append(entity)

        return inserted_entities
