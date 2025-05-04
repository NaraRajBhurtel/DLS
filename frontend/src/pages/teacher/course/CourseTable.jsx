
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "../../../../features/api/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";



const CourseTable = () => {
  const {data, isLoading} = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if(isLoading) return <h1>Loading...</h1>
  console.log("data->", data);
 
return (
    <div>
       <Button onClick={() => navigate(`create`)} className="mb-4">Create a new course</Button>
      <Table>
        <TableCaption className="mb-4">A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] px-4">Price</TableHead>
            <TableHead className="w-[100px] px-4">Status</TableHead>
            <TableHead className="w-[50px] px-4">Title</TableHead>
            <TableHead className="text-right px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium text-left px-4">{course?.coursePrice || "NA"}</TableCell>
              <TableCell className="px-4"> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
              <TableCell className="px-4">{course.courseTitle}</TableCell>
              <TableCell className="text-right px-4">
                 <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
