"use client";

import type {SelectFieldClientComponent, SelectFieldClientProps} from 'payload'
import React, {useEffect, useState} from 'react'
import {SelectInput, useField} from '@payloadcms/ui'

type Option = {
  label: string;
  value: string;
}

type OrganizationSelectComponentProps = {
  fieldName?: string;
} & SelectFieldClientProps;

export const OrganizationSelect: SelectFieldClientComponent = ({
  path,
  fieldName
}: OrganizationSelectComponentProps) => {
  const { value, setValue } = useField<string[]>({ path });
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);

      try {
        // const organizations = await fetchMobilizeOrganizations();
        // const mappedOptions = organizations.length > 0 ? organizations?.map((organization) => ({
        //   label: `${organization.name} (${organization.slug})`,
        //   value: organization.slug,
        // })) : [];

        // setOptions(mappedOptions);
      } catch (error) {
        console.error('Error loading organization options: ', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }

    void loadOptions();
  }, []);

  return (
    <div className={'field-type'}>
      <label className={'field-label'}>{fieldName ? fieldName : 'Organizations'}</label>
      <SelectInput
        path={path}
        name={fieldName ? fieldName : 'select-organizations'}
        options={options}
        value={value}
        hasMany={true}
        onChange={(selectedOption) => {
          if (!Array.isArray(selectedOption)) return;

          const newValue = selectedOption.map((option) => option.value);

          setValue(newValue);
        }}
      />
    </div>
  )
}
