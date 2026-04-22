// react
import { useCallback, useEffect, useRef, useState } from "react";

// styles
import thisCanvasStyles from "../../../assets/styles/modules/offcanvas/createinvoicecanvas.module.css";

// components
import Button from "../../button/Button";
import ItemList from "./itemList";
import BillTo from "./billTo/BillTo";
import BillForm from "./billFrom/BillFrom";

// utils
import { validateData } from "../../../utilities/validateData";

// defaults
import { defaultFormError, defaultForm } from "./defaultValues/default";

// types
import { FormDataType, FormErrorType } from "../../../types";
import localDB from "../../../services/localStorage";
import { FormTextRef } from "../../forms/Text";

interface OffCanvasFormProps {
  header: string;
  close: () => void;
  data?: FormDataType;
  updateForm?: (data: FormDataType) => void;
}

const OffCanvasForm = ({
  header,
  close,
  data,
  updateForm,
}: OffCanvasFormProps) => {
  const [formData, setFormData] = useState<FormDataType>(defaultForm);
  const [formError, setFormError] = useState<FormErrorType>(defaultFormError);
  const inputRef = useRef<FormTextRef>(null);

  const validateFormErrors = () => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        let validated: any = [];

        if (typeof value === "string") {
          validated = validateData(key, value);
          updateFormErrors(key, validated, "string");
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([key2, value2]) => {
            if (key === "items") {
              let validatedItem = Object.entries(value2).reduce(
                (acc: any, [key3, value3]) => {
                  if (key3 === "id") return { ...acc, id: value3 };
                  return {
                    ...acc,
                    [key3]: validateData(key3, value3 as string),
                  };
                },
                {},
              );
              validated = [...validated, validatedItem];
            } else {
              validated = validateData(key2, value2);
            }
            updateFormErrors(key, validated, "object", key2);
          });
        }
      });
    }
  };

  const updateFormErrors = (
    key: string,
    validated: { valid: boolean; errorMsg: string },
    type: "string" | "object",
    key2?: string,
  ) => {
    if (type === "string") {
      setFormError((prev) => ({ ...prev, [key]: validated }));
    }
    if (type === "object") {
      setFormError((prev: any) => {
        if (prev && prev[key] && key2) {
          if (key === "items") return { ...prev, [key]: validated };
          return { ...prev, [key]: { ...prev[key], [key2]: validated } };
        }
      });
    }
  };

  const submitData = (status: string) => {
    const invoiceData = { ...formData, status };
    localDB.create(invoiceData as any);
    close();
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nest?: string | null,
  ) => {
    const { name, value } = e.target;
    if (nest) {
      setFormData((prev: any) => ({
        ...prev,
        [nest]:
          prev && prev[nest]
            ? { ...prev[nest], [name]: value }
            : { [name]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateFormData = useCallback(
    (data: any) => {
      setFormData({ ...formData, ...data });
    },
    [formData, formError],
  );

  const handleUpdateFormError = (data: any) => {
    setFormError({ ...formError, ...data });
  };

  useEffect(() => {
    if (updateForm) updateForm(formData);
  }, [formData]);

  useEffect(() => {
    if (data && data.senderAddress && data.clientAddress) {
      handleUpdateFormData(data);
    }
  }, [data]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text--h2">{header}</h2>
      <BillForm
        handleInputChange={handleInputChange}
        formData={formData}
        formError={formError}
        inputRef={inputRef}
      />

      <BillTo
        handleInputChange={handleInputChange}
        update={handleUpdateFormData}
        formError={formError}
        inputRef={inputRef}
        formData={formData}
      />

      <ItemList
        update={handleUpdateFormData}
        updateErrorForm={handleUpdateFormError}
        formError={formError}
        formData={formData}
      />

      <div className={thisCanvasStyles.buttons}>
        <Button variant="editButton" onClick={close} type="button">
          Discard
        </Button>
        <Button
          variant="saveAsDraftButton"
          type="button"
          onClick={() => submitData("draft")}
        >
          Save as Draft
        </Button>
        <Button type="button" onClick={() => submitData("pending")}>
          Save & Send
        </Button>
      </div>
    </form>
  );
};

export default OffCanvasForm;
