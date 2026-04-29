import { FormBuilderProvider } from "../../context/FormBuilderContext";
import FormBuilder from "./FormBuilder";

const ApplicationFormBuilder = ({ programId }) => {
  return (
    <div className="h-full">
      <FormBuilder />
    </div>
  );
};

export default ApplicationFormBuilder;