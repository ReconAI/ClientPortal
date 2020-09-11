"""
Shared forms module
"""

from typing import Any, Dict, Optional

from django.forms import Form


class NegativeFiltersForm(Form):
    """
    For the data with dashes lead up to keys filter will turn into negative one
    """

    def __init__(self, data=None, *args, **kwargs):
        self.negated_fields = set()

        normalized_data = self.__normalize_negated(data)

        super().__init__(data=normalized_data, *args, **kwargs)

    def __normalize_negated(self,
                            data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        :type data: Optional[Dict[str, Any]]

        :rtype: Dict[str, Any]
        """
        if data:
            normalized = {}

            for data_key, data_value in data.items():
                if data_key.startswith('-'):
                    data_key = data_key[1:]
                    self.negated_fields.add(data_key)

                normalized[data_key] = data_value

            return normalized

        return data
