import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const FormBuilderContext = createContext();

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

const initialFormState = {
  id: null,
  name: "Untitled Form",
  description: "",
  fields: [],
  status: "draft",
  internshipId: null,
  publishedUrl: "",
};

export const FormBuilderProvider = ({ children, programId, internshipId: propInternshipId }) => {
  const initialInternshipId = programId || propInternshipId || null;
  const [formState, setFormState] = useState({
    ...initialFormState,
    internshipId: initialInternshipId,
  });
  const [activeFieldId, setActiveFieldId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("builder"); // "builder" or "properties"
  const [pendingSpecialField, setPendingSpecialField] = useState(null);

  // Registry for handlers that need local component context
  const [handlers, setHandlers] = useState({
    onSave: null,
    onPublish: null,
    onPreview: null,
  });

  const registerHandlers = useCallback((newHandlers) => {
    setHandlers(prev => ({ ...prev, ...newHandlers }));
  }, []);

  const resetFormBuilder = useCallback(() => {
    setFormState({
      ...initialFormState,
      internshipId: initialInternshipId,
    });
    setActiveFieldId(null);
  }, [programId]);

  const addField = useCallback((type) => {
    // 🔥 Check if adding a "Special Component" (Banner, PDF, Carousel)
    const specialTypes = ['bannerUpload', 'pdfUpload', 'carouselUpload'];
    if (specialTypes.includes(type)) {
      const existingSpecial = formState.fields.find(f => specialTypes.includes(f.type));
      if (existingSpecial) {
        // Instead of window.confirm, set pending field
        setPendingSpecialField({
          newType: type,
          oldId: existingSpecial.id,
          oldType: existingSpecial.type
        });
        return;
      }
    }

    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: `Untitled ${type}`,
      placeholder: "",
      required: false,
      width: "full",
      options: type === "select" || type === "radio" ? [{ label: "Option 1", value: "option1" }] : [],
    };

    setFormState((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setActiveFieldId(newField.id);
  }, [formState.fields]);

  const confirmReplaceSpecial = useCallback(() => {
    if (!pendingSpecialField) return;

    const { newType, oldId } = pendingSpecialField;
    const newField = {
      id: `field_${Date.now()}`,
      type: newType,
      label: `Untitled ${newType}`,
      placeholder: "",
      required: false,
      width: "full",
      options: newType === "select" || newType === "radio" ? [{ label: "Option 1", value: "option1" }] : [],
    };

    setFormState((prev) => ({
      ...prev,
      fields: [...prev.fields.filter(f => f.id !== oldId), newField],
    }));
    setActiveFieldId(newField.id);
    setPendingSpecialField(null);
  }, [pendingSpecialField]);

  const cancelReplaceSpecial = useCallback(() => {
    setPendingSpecialField(null);
  }, []);

  const deleteField = useCallback((id) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
    if (activeFieldId === id) setActiveFieldId(null);
  }, [activeFieldId]);

  const updateFieldProperties = useCallback((id, properties) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...properties } : f)),
    }));
  }, []);

  const getActiveField = useCallback(() => {
    return formState.fields.find((f) => f.id === activeFieldId) || null;
  }, [formState.fields, activeFieldId]);

  const setActiveField = useCallback((id) => {
    setActiveFieldId(id);
    setSidebarTab("properties");
  }, []);

  // Helpers for canvas layout
  const hasBannerComponent = useMemo(() => formState.fields.some(f => f.type === 'bannerUpload'), [formState.fields]);
  const hasPdfComponent = useMemo(() => formState.fields.some(f => f.type === 'pdfUpload'), [formState.fields]);
  const hasCarouselComponent = useMemo(() => formState.fields.some(f => f.type === 'carouselUpload'), [formState.fields]);

  const moveFieldUp = useCallback((id) => {
    setFormState((prev) => {
      const index = prev.fields.findIndex((f) => f.id === id);
      if (index <= 0) return prev;
      const newFields = [...prev.fields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      return { ...prev, fields: newFields };
    });
  }, []);

  const moveFieldDown = useCallback((id) => {
    setFormState((prev) => {
      const index = prev.fields.findIndex((f) => f.id === id);
      if (index === -1 || index >= prev.fields.length - 1) return prev;
      const newFields = [...prev.fields];
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
      return { ...prev, fields: newFields };
    });
  }, []);

  const value = {
    formState,
    setFormState,
    activeFieldId,
    setActiveField,
    getActiveField,
    addField,
    deleteField,
    updateFieldProperties,
    moveFieldUp,
    moveFieldDown,
    resetFormBuilder,
    showPreviewModal,
    setShowPreviewModal,
    showPublishModal,
    setShowPublishModal,
    hasBannerComponent,
    hasPdfComponent,
    hasCarouselComponent,
    isSaving,
    setIsSaving,
    isPublishing,
    setIsPublishing,
    handlers,
    registerHandlers,
    sidebarTab,
    setSidebarTab,
    pendingSpecialField,
    confirmReplaceSpecial,
    cancelReplaceSpecial,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};
