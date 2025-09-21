"use client";

import styles from './ActivityCheckboxes.module.scss'; 

interface ActivityCheckboxesProps {
  activities: string[];
  selectedActivities: string[];
  setSelectedActivities: (acts: string[]) => void;
}

export const ActivityCheckboxes = ({
  activities,
  selectedActivities,
  setSelectedActivities,
}: ActivityCheckboxesProps) => {
  if (!activities.length) {
    return <span style={{ color: "#888" }}>Loading activities...</span>;
  }

  const allChecked =
    selectedActivities.includes("Any") ||
    activities.every((a) => selectedActivities.includes(a));

  const handleChange = (activity: string, checked: boolean) => {
    if (activity === "Any") {
      setSelectedActivities(checked ? ["Any", ...activities] : []);
    } else {
      let updated = selectedActivities.filter((a) => a !== "Any");
      if (checked) {
        updated = [...updated, activity];
        if (updated.length === activities.length) updated = ["Any", ...activities];
      } else {
        updated = updated.filter((a) => a !== activity);
      }
      setSelectedActivities(updated.length ? updated : ["Any"]);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => handleChange("Any", e.target.checked)}
        />{" "}
        Any
      </label>
      <br />
      {activities.map((act) => {
        const id = `activity-${act.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <span key={id}>
            <label>
              <input
                type="checkbox"
                id={id}
                checked={
                  allChecked || selectedActivities.includes(act)
                }
                onChange={(e) => handleChange(act, e.target.checked)}
              />{" "}
              {act}
            </label>
            <br />
          </span>
        );
      })}
    </div>
  );
};

export default ActivityCheckboxes;