import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "../../../../features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get courseId from the URL

  // Fetch course details
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    error: courseByIdError,
    refetch,
  } = useGetCourseByIdQuery(courseId, {
    skip: !courseId, // Skip the query if courseId is undefined
  });

  // Mutations
  const [editCourse, { isLoading: isEditing, isSuccess, error: editError }] =
    useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();
  const [removeCourse, { isLoading: isRemoving }] = useRemoveCourseMutation();

  // Populate input fields when course data is fetched
  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  // Handle input changes
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  // Handle thumbnail selection
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  // Update course
  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    try {
      await editCourse({ formData, courseId }).unwrap();
      toast.success("Course updated successfully.");
      refetch();
    } catch (error) {
      toast.error("Failed to update course.");
    }
  };

  // Publish or unpublish course
  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action }).unwrap();
      refetch();
      toast.success(response.message || "Course status updated.");
    } catch (error) {
      toast.error("Failed to update course status.");
    }
  };

  // Remove course
  const removeCourseHandler = async () => {
    try {
      const response = await removeCourse(courseId).unwrap();
      toast.success(response.message || "Course removed successfully.");
      navigate("/teacher/course"); // Redirect to course list
    } catch (error) {
      toast.error("Failed to remove course.");
    }
  };

  // Handle success and error for editing
  useEffect(() => {
    if (isSuccess) {
      toast.success("Course updated successfully.");
    }
    if (editError) {
      toast.error("Failed to update course.");
    }
  }, [isSuccess, editError]);

  // Fallback for loading or error states
  if (courseByIdLoading) return <h1>Loading...</h1>;
  if (courseByIdError) return <h1>Error loading course details.</h1>;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Make changes to your course</CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            variant="outline"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="destructive"
            onClick={removeCourseHandler}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove Course"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={input.courseTitle}
            onChange={changeEventHandler}
            placeholder="For e.g. Big Data"
          />
        </div>
        <div className="space-y-4 mt-5">
          <Label>Subtitle</Label>
          <Input
            type="text"
            name="subTitle"
            value={input.subTitle}
            onChange={changeEventHandler}
            placeholder="For e.g. Become a Data Scientist"
          />
        </div>
        <div className="space-y-4 mt-5">
          <Label>Description</Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>
        <div className="flex items-center gap-5">
          <div>
            <Label>Category</Label>
            <Select defaultValue={input.category} onValueChange={selectCategory}>
              <SelectTrigger className="w-[180px] mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="System Architecture">System Architecture</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Fullstack Development">
                    Fullstack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Docker">Docker</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Course Level</Label>
            <Select
              defaultValue={input.courseLevel}
              onValueChange={selectCourseLevel}
            >
              <SelectTrigger className="w-[180px] mt-1">
                <SelectValue placeholder="Select course difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course Level</SelectLabel>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Intermediate</SelectItem>
                  <SelectItem value="Advance">Expert</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              placeholder="For e.g. 999"
              className="w-fit"
            />
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="e-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div>
            <Button
              onClick={() => navigate("/teacher/course")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isEditing} onClick={updateCourseHandler}>
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;