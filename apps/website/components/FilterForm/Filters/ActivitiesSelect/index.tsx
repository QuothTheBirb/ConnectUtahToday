import Select from "react-select";

import {FormInput} from "@/components/FormInput";
import styles from './ActivitiesSelect.module.scss';

type ActivitiesSelectProps = {
  activities: string[];
  selectedActivities: string[];
  setSelectedActivities: (acts: string[]) => void;
}

export const ActivitiesSelect = ({
  activities,
  selectedActivities,
  setSelectedActivities,
}: ActivitiesSelectProps) => {
  if (!activities.length) {
    return <span className={styles.loading}>Loading activities...</span>;
  }

  const options = activities.map((activity) => ({
    value: activity,
    label: activity,
  }));
  const selectedOptions = selectedActivities.map((activity) => ({
    value: activity,
    label: activity,
  }));

  const handleChange = (selected: readonly { value: string; label: string }[]) => {
    setSelectedActivities(selected ? selected.map((option) => option.value) : [])
  }

  return (
    <FormInput label={'Activities'} htmlFor={'activities'}>
      <Select
        inputId={'activities'}
        isMulti={true}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={'Any'}
        isClearable={true}
      />
    </FormInput>
  );
};

export default ActivitiesSelect;
