import { FormHandles } from "@unform/core";
import { useRef, useCallback } from "react";

export const UseVForm = () => {
  const formRef = useRef<FormHandles>(null);
  const isSaveAndClose = useRef(false);
  const isSaveAndNew = useRef(false);

  const handleSave = useCallback(() => {
    isSaveAndClose.current = false;
    isSaveAndNew.current = false;
    formRef.current?.submitForm();
  }, []);

  const handleSaveAndClose = useCallback(() => {
    isSaveAndClose.current = true;
    isSaveAndNew.current = false;
    formRef.current?.submitForm();
  }, []);

  const handleSaveAndNew = useCallback(() => {
    isSaveAndClose.current = false;
    isSaveAndNew.current = true;
    formRef.current?.submitForm();
  }, []);

  const handleIsSaveAndClose = useCallback(() => {
    return isSaveAndClose;
  }, []);

  const handleIsSaveAndNew = useCallback(() => {
    return isSaveAndNew;
  }, []);

  return {
    formRef,
    save: handleSave,
    saveAndClose: handleSaveAndClose,
    saveAndNew: handleSaveAndNew,
    IsSaveAndClose: handleIsSaveAndClose,
    isSaveAndNew: handleIsSaveAndNew,
  };
};
