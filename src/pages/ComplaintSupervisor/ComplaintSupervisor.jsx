import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

import ComplaintCategorization from "../../components/ComplaintCategorization/ComplaintCategorization";
import ComplaintValidation from "../../components/ComplaintValidation/ComplaintValidation";

const ComplaintSupervisor = () => {
  const { complaintData } = useAppContext();
  const [isValid, setIsValid] = useState(
    complaintData.validationStatus && complaintData.validationNotes,
  );

  useEffect(() => {
    setIsValid(complaintData.validationStatus && complaintData.validationNotes);
  }, [complaintData]);

  if (isValid) {
    return <ComplaintCategorization />;
  }

  if (!complaintData.validationStatus && !complaintData.validationNotes) {
    return <ComplaintValidation />;
  }

  return <div>Some error occurred </div>;
};

export default ComplaintSupervisor;
