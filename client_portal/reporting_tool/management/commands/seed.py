from django_seed import Seed
from django_seed.exceptions import SeederCommandError
from django_seed.management.commands.seed import Command as CommandBase
from ._utils import Seeder


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

        parser.add_argument(
            '--take-all-existent',
            action='append',
            default=[],
            help='Grap all rows for the specified models'
                 ' rather than insert new ones [,]'
        )

    def dependencies(self, model):
        dependencies = set()

        for field in model._meta.get_fields():
            if True in [field.many_to_one, field.one_to_one] \
                    and field.concrete \
                    and field.blank is False:
                dependencies.add(field.related_model)

        return dependencies
