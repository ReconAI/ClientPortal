"""
Database routers are defined here
"""
from typing import Optional, Type

from django.conf import settings
from django.db.models import Model

from reporting_tool.models import User, UserGroup, Token


class DBRouter:
    """
    Base class for db routers.
    Relate models/moduels to according db for proper routing.
    """
    app_label_routers = {}
    models_routers = {}

    prohibit_migration_app_labels = []
    prohibit_migration_model_names = []

    allow_relation_map = {}

    def db_for_read(self, model: Type[Model], **hints: dict) -> Optional[str]:
        """
        All reads related to recon ai db models should be directed
        to respective database

        :type model: Model
        :type hints: dict

        :rtype: Optional[str]
        """
        if model in self.models_routers:
            return self.models_routers.get(model)

        app_label = model._meta.app_label
        if app_label in self.app_label_routers:
            return self.app_label_routers.get(app_label)

        return None

    def allow_relation(self, obj1: Model, obj2: Model) -> Optional[bool]:
        """
        Checks whether relation between two models are allowed

        :type obj1: Model
        :type obj2: Model

        :rtype: Optional[bool]
        """
        obj1_class = obj1.__class__
        obj2_class = obj2.__class__

        is_relation_allowed = (
            self.__is_relation_allowed(obj1_class, obj2_class)
            or self.__is_relation_allowed(obj2_class, obj1_class)
        )

        if is_relation_allowed:
            return True

        return None

    def db_for_write(self, model: Type[Model], **hints: dict) -> Optional[str]:
        """
        All writes related to recon ai db models should be directed
        to respective database

        :type model: Model
        :type hints: dict

        :rtype: Optional[str]
        """
        if model in self.models_routers:
            return self.models_routers.get(model)

        app_label = model._meta.app_label
        if app_label in self.app_label_routers:
            return self.app_label_routers.get(app_label)

        return None

    def allow_migrate(self, database: str, app_label: str,
                      model_name: Optional[str] = None,
                      **hints: dict) -> Optional[bool]:
        """
        Make sure the auth and contenttypes apps only appear in the
        'auth_db' database.

        :type database: str
        :type app_label:  str
        :type model_name: Optional[str]
        :type hints: dict

        :rtype: Optional[bool]
        """

        if model_name in self.prohibit_migration_model_names:
            return False

        if app_label in self.prohibit_migration_app_labels:
            return False

        return None

    def __is_relation_allowed(self, cls1: Type[Model],
                              cls2: Type[Model]) -> bool:
        """
        :type cls1: Type[Model]
        :type cls2: Type[Model]

        :rtype: bool
        """

        return cls1 in self.allow_relation_map.get(cls2, [])


class ReconDBRouter(DBRouter):
    """
    A router to control all database operations
    on models for Recon AI database.
    """
    app_label_routers = {
        'recon_db_manager': settings.RECON_AI_CONNECTION_NAME
    }
    models_routers = {
        User: settings.RECON_AI_CONNECTION_NAME,
        UserGroup: 'default',
        Token: 'default',
    }

    prohibit_migration_model_names = [
        'logentry'
    ]
    prohibit_migration_app_labels = [
        'recon_db_manager',
        'authtoken'
    ]

    allow_relation_map = {
        User: [UserGroup, Token]
    }
