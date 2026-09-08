import React from "react";
import { useAppContext } from "../../context/AppContext";

const ComplaintCategorization = () => {
  const { complaintData, updateComplaintData } = useAppContext();

  return (
    <main>
      <label htmlFor="complaint-category">Complaint category</label>
      <input
        id="complaint-category"
        value={complaintData.category}
        onChange={(event) =>
          updateComplaintData({ category: event.target.value })
        }
      />
    </main>
  );
};

export default ComplaintCategorization;
