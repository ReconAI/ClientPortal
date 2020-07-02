from copy import copy
from logging import warn

from django.db.models import OneToOneField
from django.utils.module_loading import import_string
from django_seed import Seed
from django_seed.exceptions import SeederException, SeederCommandError
from django_seed.management.commands.seed import Command as CommandBase
from django_seed.seeder import Seeder as BaseSeeder, \
    ModelSeeder as BaseModelSeeder
import random


class Inserted:
    def __init__(self, field, related_model):
        self.__inserted = None
        self.__field = field
        self.__related_model = related_model

    def __invoke__(self, inserted):
        if self.__related_model in inserted and inserted[self.__related_model]:
            self.set_inserted(inserted[self.__related_model])

            return self.__related_model.objects.get(pk=self.__inserted.pop())
        else:
            message = 'Field {} cannot be null'.format(self.__field)
            raise SeederException(message)

    def __call__(self, inserted):
        return self.__invoke__(inserted)

    def set_inserted(self, inserted):
        if self.__inserted is None:
            self.__inserted = copy(inserted)
            random.shuffle(self.__inserted)


class ModelSeeder(BaseModelSeeder):
    @staticmethod
    def build_relation(field, related_model):
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
                self._take_all_existent.append(import_string(take_all_existent_class))
            except ImportError:
                warn('No such class {}'.format(take_all_existent_class))

    def add_entity(self, model, number, customFieldFormatters=None):
        """
        Add an order for the generation of $number records for $entity.

        :param model: mixed A Django Model classname,
        or a faker.orm.django.EntitySeeder instance
        :type model: Model
        :param number: int The number of entities to seed
        :type number: integer
        :param customFieldFormatters: optional dict with field as key and
        callable as value
        :type customFieldFormatters: dict or None
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
                inserted_entities[klass] = list(klass.objects.values_list(klass._meta.pk.name, flat=True))
                continue

            number = self.quantities[klass]
            if klass not in inserted_entities:
                inserted_entities[klass] = []
            for i in range(0, number):
                entity = self.entities[klass].execute(using, inserted_entities)
                inserted_entities[klass].append(entity)

        return inserted_entities


class Command(CommandBase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        code = Seed.codename()
        faker = Seed.fakers.get(code, None) or Seed.faker(codename=code)

        Seed.seeders[Seed.codename()] = Seeder(faker)

    def handle_app_config(self, app_config, **options):
        if app_config.models_module is None:
            raise SeederCommandError('You must provide an app to seed')

        try:
            number = int(options['number'])
        except ValueError:
            raise SeederCommandError(
                'The value of --number must be an integer')

        seeder = Seed.seeder()
        seeder.set_take_all_existent(options['take_all_existent'])

        for model in self.sorted_models(app_config):
            seeder.add_entity(model, number)
            print('Seeding %i %ss' % (number, model.__name__))

        generated = seeder.execute()

        for model, pks in generated.items():
            for pk in pks:
                print("Model {} generated record with primary key {}".format(
                    model.__name__,
                    pk
                ))

    def add_arguments(self, parser):
        super().add_arguments(parser)

        parser.add_argument('--take-all-existent', action='append', default=[], help='Grap all rows for the specified models rather than insert new ones [,]')

    def dependencies(self, model):
        dependencies = set()

        for field in model._meta.get_fields():
            if True in [field.many_to_one,
                        field.one_to_one] and field.concrete and field.blank is False:
                dependencies.add(field.related_model)

        return dependencies
