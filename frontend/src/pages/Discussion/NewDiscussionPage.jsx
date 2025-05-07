import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCreateDiscussionMutation } from "../../../features/api/discussionApi";

const NewDiscussionPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createDiscussion, { isLoading }] = useCreateDiscussionMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await createDiscussion(formData).unwrap();
      toast.success("Discussion created!");
      navigate("/discussion");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create discussion");
    }
  };

  // Instructor check
  if (user?.role !== "instructor") {
    return <div className="p-8 text-center text-lg">Access Denied</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate("/discussion")}>
          Back to Discussion
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Create New Discussion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <Textarea
          placeholder="Description"
          name="description"
          rows={6}
          value={formData.description}
          onChange={handleChange}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Discussion"}
        </Button>
      </form>
    </div>
  );
};

export default NewDiscussionPage;
