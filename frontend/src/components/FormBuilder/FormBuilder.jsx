import { useState, useEffect, useCallback } from 'react';
import { useFormBuilder } from '../../context/FormBuilderContext';
import FormHeader from './FormHeader';
import ComponentsPanel from './ComponentsPanel';
import FormCanvas from './FormCanvas';
import PropertyEditor from './PropertyEditor';
import PreviewModal from './modals/PreviewModal';
import PublishModal from './modals/PublishModal';
import { useToast } from './hooks/use-toast';
import apiClient, { API_BASE_URL } from "../../services/apiClient";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { useOpportunities } from '../../context/OpportunitiesContext';

const FormBuilder = ({ formId, internshipId: propInternshipId }) => {
const [searchParams] = useSearchParams();
const urlInternshipId = searchParams.get("internshipId");
const { 
  formState,
  setFormState,
  showPreviewModal,
  setShowPreviewModal,
  showPublishModal,
  setShowPublishModal,
  resetFormBuilder,
  registerHandlers,
  setIsPublishing
} = useFormBuilder();

const internshipId = propInternshipId || urlInternshipId || formState.internshipId;

const [publishing, setPublishing] = useState(false);

const cleanFields = (fields) => {
  return fields.map(field => {
    const newField = { ...field };

    // remove direct heavy props
    delete newField.preview;
    delete newField.dataUrl;
    delete newField.fileName;

    // remove banner base64
    if (newField.bannerUrl && newField.bannerUrl.startsWith("data:")) {
      newField.bannerUrl = "";
    }

    // remove pdf base64
    if (newField.pdfUrl && newField.pdfUrl.startsWith("data:")) {
      newField.pdfUrl = "";
    }

    // remove carousel images base64
    if (newField.images && Array.isArray(newField.images)) {
      newField.images = newField.images.map(img => ({
        ...img,
        dataUrl: undefined,
        preview: undefined
      }));
    }

    return newField;
  });
};

console.log("📥 RESOLVED internshipId:", internshipId);

 useEffect(() => {
  if (internshipId && !formState.internshipId) {
    console.log("✅ SETTING internshipId:", internshipId);

    setFormState(prev => ({
      ...prev,
      internshipId
    }));
  }
}, [internshipId, formState.internshipId]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadOpportunities } = useOpportunities();

  // Load form data if editing existing form
useEffect(() => {
  const loadForm = async () => {
    if (formId) {
      try {
        const response = await apiClient.get(`/api/forms/${formId}`);
        const formData = response.data;

        setFormState(prev => ({
          ...prev,
          id: formData._id || formData.id,
          name: formData.name,
          description: formData.description,
          fields: formData.formSchema?.fields || [],
          status: formData.status
        }));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load form',
          variant: 'destructive'
        });
      }
    } else {
  resetFormBuilder();

  if (internshipId) {
    console.log("♻️ RESET KE BAAD SET internshipId:", internshipId);

    setFormState(prev => ({
      ...prev,
      internshipId
    }));
  }
}
  };

  loadForm();
}, [formId, setFormState, resetFormBuilder, toast]);

 const handleSaveDraft = useCallback(async () => {
  console.log("Save draft started");

  try {
    // validation
    if (
  !formState.name || formState.name === 'Untitled Form' ||
  !formState.description || formState.description.trim() === ''
) {
  toast({
    title: 'Required Fields Missing',
    description: 'Please add form name and description before continuing.',
    variant: 'destructive'
  });
  return;
}

    if (!formState.fields || formState.fields.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please add at least one field to your form before saving.',
        variant: 'warning'
      });
      return;
    }

    // clean form data
    const formData = {
      name: formState.name || 'Untitled Form',
      description: formState.description || '',
      formSchema: { fields: cleanFields(formState.fields) },
      status: 'draft',
    };

    if (formId) {
      // ✅ UPDATE
      console.log("Updating existing form:", formId);

     const fd = new FormData();
fd.append("formData", JSON.stringify(formData));

const res = await apiClient.put(
  `/api/forms/${formId}`,
  fd
);

      console.log("Update response:", res.data);

      toast({
        title: 'Success',
        description: 'Form saved as draft successfully',
      });

    } else {
      // ✅ CREATE
      console.log("Creating new form");

      const fd = new FormData();

// JSON
fd.append("formData", JSON.stringify(formData));

// 🔥 FILES ADD
formState.fields.forEach(field => {

  console.log("🧠 FIELD:", field);

  // ✅ BANNER
  if (field.type === "bannerUpload" && field.value?.file) {
    console.log("📤 SENDING BANNER:", field.value.file);

    fd.append(`files[${field.id}]`, field.value.file);
  }

  // ✅ PDF
  if (field.type === "pdfUpload" && field.value?.file) {
    fd.append(`files[${field.id}]`, field.value.file);
  }

  // ✅ CAROUSEL
  if (field.type === "carouselUpload" && field.images) {
    field.images.forEach(img => {
      if (img.file) {
        fd.append(`files[${field.id}]`, img.file);
      }
    });
  }

});

// CREATE
const res = await apiClient.post(
  '/api/forms',
  fd
);

      const response = res.data;
      console.log("Created form:", response);

      const newFormId = response.data._id;

      if (!newFormId) {
        throw new Error("Form ID not received from backend");
      }

      setFormState(prev => ({
        ...prev,
        id: newFormId
      }));

      toast({
        title: 'Success',
        description: 'Form created and saved as draft',
      });
    }

  } catch (error) {
    console.error("Error saving form:", error);

    toast({
      title: 'Error',
      description: `Failed to save form: ${error.message}`,
      variant: 'destructive'
    });
  }
}, [formId, formState, setFormState, toast]);

const handlePublish = useCallback(async () => {
  if (publishing) return;
  setPublishing(true);

  try {
    // ✅ VALIDATIONS
    if (
      !formState.name || formState.name.trim() === '' || formState.name === 'Untitled Form' ||
      !formState.description || formState.description.trim() === ''
    ) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please add a unique form name and a detailed description before publishing.',
        variant: 'destructive'
      });
      setPublishing(false); // 🔥 MUST RESET HERE
      return;
    }

    if (!formState.fields || formState.fields.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please add at least one field to your form before publishing.',
        variant: 'warning'
      });
      setPublishing(false);
      return;
    }

    const hasRequiredField = formState.fields.some(f => f.required);
    if (!hasRequiredField) {
      toast({
        title: "Required Field Missing",
        description: "Please mark at least one field as required before publishing.",
        variant: "destructive"
      });
      setPublishing(false);
      return;
    }

    const formData = {
      name: formState.name,
      description: formState.description,
      formSchema: { fields: cleanFields(formState.fields) },
      status: 'draft',
    };

    // ✅ CREATE FORM DATA (IMPORTANT)
    const fd = new FormData();
    fd.append("formData", JSON.stringify(formData));

    // 🔥 FILES ADD
  formState.fields.forEach(field => {

  console.log("🧠 FIELD:", field);

  // ✅ BANNER
  if (field.type === "bannerUpload" && field.value?.file) {
    console.log("📤 SENDING BANNER:", field.value.file);

    fd.append(`files[${field.id}]`, field.value.file);
  }

  // ✅ PDF
  if (field.type === "pdfUpload" && field.value?.file) {
    fd.append(`files[${field.id}]`, field.value.file);
  }

  // ✅ CAROUSEL
  if (field.type === "carouselUpload" && field.images) {
    field.images.forEach(img => {
      if (img.file) {
        fd.append(`files[${field.id}]`, img.file);
      }
    });
  }

});

    let formToPublishId = formState.id || formId;

    // =========================
    // ✅ CREATE FORM (IF NEW)
    // =========================
    if (!formToPublishId) {
      const res = await apiClient.post(
        '/api/forms',
        fd
      );

      const newFormId = res.data.data._id;

      if (!newFormId) throw new Error("Form ID not received");

      formToPublishId = newFormId;

      setFormState(prev => ({
        ...prev,
        id: newFormId
      }));

      console.log("✅ NEW FORM CREATED:", newFormId);
    }

    // =========================
    // ✅ UPDATE FORM (IF EXIST)
    // =========================
    else {
      await apiClient.put(
        `/api/forms/${formToPublishId}`,
        fd
      );

      console.log("✅ FORM UPDATED:", formToPublishId);
    }

    // =========================
    // ✅ PUBLISH FORM
    // =========================
    const res = await apiClient.post(
      `/api/forms/${formToPublishId}/publish`
    );

    const publishedForm = res.data;

    console.log("🚀 FORM PUBLISHED:", publishedForm);

    // =========================
    // ✅ ATTACH TO INTERNSHIP
    // =========================
    const finalInternshipId = formState.internshipId || internshipId;

    console.log("🧠 FINAL internshipId:", finalInternshipId);
    console.log("🧠 FORM ID:", formToPublishId);

    if (finalInternshipId) {
      console.log("🔗 ATTACHING FORM:", finalInternshipId);

      await apiClient.put(
        `/api/internships/${finalInternshipId}/attach-form`,
        { formId: formToPublishId }
      );

      const check = await apiClient.get(
        `/api/internships/${finalInternshipId}`
      );

      // Refresh global opportunities state so "Apply Now" shows the new form
      await loadOpportunities();

      console.log("🔥 FINAL INTERNSHIP DATA:", check.data);
    }

    // =========================
    // ✅ UPDATE STATE
    // =========================
    setFormState(prev => ({
      ...prev,
      status: 'published',
      publishedUrl: publishedForm?.publishedUrl
    }));

    toast({
      title: "Successfully Published! 🎉",
      description: "Your application form is now live and linked to the internship. Redirecting to dashboard...",
      variant: "success",
      duration: 3000
    });

    setTimeout(() => {
      navigate("/admin-dashboard");
    }, 3000);

  } catch (error) {
    console.error("❌ PUBLISH ERROR:", error);

    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive'
    });
  } finally {
    setPublishing(false);
  }

}, [publishing, formId, formState, setFormState, toast, navigate]);

  const handlePreview = useCallback(() => {
  if (
    !formState.name || formState.name === 'Untitled Form' ||
    !formState.description || formState.description.trim() === ''
  ) {
    toast({
      title: 'Required Fields Missing',
      description: 'Please add form name and description before preview.',
      variant: 'destructive'
    });
    return;
  }

  setShowPreviewModal(true);
}, [formState.name, formState.description, setShowPreviewModal, toast]);

  useEffect(() => {
    registerHandlers({
      onSave: handleSaveDraft,
      onPublish: handlePublish,
      onPreview: handlePreview
    });
  }, [registerHandlers, handleSaveDraft, handlePublish, handlePreview]);

  return (
    <div id="formBuilder" className="h-full flex flex-col">
      <FormHeader 
        onPreview={handlePreview}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <div className="flex flex-1 overflow-hidden">
        <ComponentsPanel />
        <FormCanvas />
        <PropertyEditor />
      </div>

      {showPreviewModal && (
        <PreviewModal 
          onClose={() => setShowPreviewModal(false)}
          formFields={formState.fields}
          formName={formState.name || 'Untitled Form'}
        />
      )}
      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          formId={formState.id}
          publishedUrl={formState.publishedUrl}
          formState={formState}
        />
      )}
    </div>
  );
};

export default FormBuilder;