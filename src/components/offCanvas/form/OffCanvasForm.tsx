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
import { ItemTypeError } from "../../../types/ItemType";
import localDB from "../../../services/localStorage";
import { FormTextRef } from "../../forms/Text";

type ValidatedItem = ItemTypeError;

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
        if (typeof value === "string") {
          const validated = validateData(key, value);
          updateFormErrors(key, validated, "string");
        } else if (typeof value === "object") {
          if (key === "items") {
            const validated: ValidatedItem[] = [];
            Object.entries(value).forEach(([, value2]) => {
              const validatedItem: ValidatedItem = Object.entries(
                value2,
              ).reduce(
                (acc, [key3, value3]) => {
                  if (key3 === "id") {
                    return { ...acc, id: value3 as string };
                  }
                  return {
                    ...acc,
                    [key3]: validateData(key3, value3 as string),
                  };
                },
                {} as Omit<ValidatedItem, "id"> & { id?: string },
              ) as ValidatedItem;
              validated.push(validatedItem);
            });
            updateFormErrors(key, validated, "object");
          } else {
            Object.entries(value).forEach(([key2, value2]) => {
              const validated = validateData(key2, value2);
              updateFormErrors(key, validated, "object", key2);
            });
          }
        }
      });
    }
  };

  const updateFormErrors = (
    key: string,
    validated: { valid: boolean; errorMsg: string } | ValidatedItem[],
    type: "string" | "object",
    key2?: string,
  ) => {
    if (type === "string") {
      setFormError((prev) => ({
        ...prev,
        [key]: validated as { valid: boolean; errorMsg: string },
      }));
    }
    if (type === "object") {
      if (key === "items") {
        setFormError((prev) => ({
          ...prev,
          [key]: validated as ValidatedItem[],
        }));
      } else {
        setFormError((prev) => {
          const prevKey = prev[key as keyof FormErrorType];
          if (prevKey && typeof prevKey === "object" && key2) {
            return {
              ...prev,
              [key]: {
                ...prevKey,
                [key2]: validated as { valid: boolean; errorMsg: string },
              },
            };
          }
          return prev;
        });
      }
    }
  };

  const submitData = (status: string) => {
    const invoiceData = { ...formData, status };
    localDB.create(invoiceData);
    close();
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nest?: string | null,
  ) => {
    const { name, value } = e.target;
    if (nest) {
      setFormData((prev: FormDataType) => ({
        ...prev,
        [nest]:
          prev && prev[nest as keyof FormDataType]
            ? { ...(prev[nest as keyof FormDataType] as object), [name]: value }
            : { [name]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateFormData = useCallback((data: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }) as FormDataType);
  }, []);

  const handleUpdateFormError = (data: Partial<FormErrorType>) => {
    setFormError({ ...formError, ...data });
  };

  useEffect(() => {
    if (updateForm) updateForm(formData);
  }, [formData, updateForm]);

  useEffect(() => {
    if (data && data.senderAddress && data.clientAddress) {
      handleUpdateFormData(data);
    }
  }, [data, handleUpdateFormData]);

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
        <Button
          type="button"
          onClick={() => {
            validateFormErrors();
            // check directly from formData (not state) so it's synchronous
            const hasClientName = !!formData?.clientName;
            const hasDescription = !!formData?.description;
            const hasItems = !!formData?.items?.length;
            if (hasClientName && hasDescription && hasItems) {
              submitData("pending");
            }
          }}
        >
          Save & Send
        </Button>
      </div>
    </form>
  );
};

export default OffCanvasForm;
