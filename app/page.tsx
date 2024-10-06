"use client";
import React, { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type Course = {
  id: number;
  title: string;
  content: string;
};

const Page = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [isFirstLetterColored, setIsFirstLetterColored] = useState<boolean>(false);
  const [isRemainingLettersHidden, setIsRemainingLettersHidden] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseContent, setNewCourseContent] = useState<string>("");
  console.log(content);
  // Load courses from localStorage on page load
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Update content and word count
  const updateContent = () => {
    if (divRef.current) {
      const newContent = divRef.current.innerText;
      setContent(newContent);
      setWordCount(newContent.trim().split(/\s+/).length);

      // Update content of selected course
      const updatedCourses = courses.map((course) =>
        course.title === selectedCourse?.title ? { ...course, content: newContent } : course
      );
      setCourses(updatedCourses);
      localStorage.setItem("courses", JSON.stringify(updatedCourses)); // Save updated courses
    }
  };

  // Handle course selection
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setContent(course.content);
    if (divRef.current) {
      divRef.current.innerText = course.content;
    }
  };

  // Handle new course creation
  const handleCreateCourse = () => {
    if (newCourseTitle.trim() && newCourseContent.trim()) {
      const newCourse: Course = {
        id: courses.length + 1,
        title: newCourseTitle,
        content: newCourseContent,
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      localStorage.setItem("courses", JSON.stringify(updatedCourses)); // Save updated courses
      setNewCourseTitle("");
      setNewCourseContent("");
    }
  };

  // Toggle first letter color
  const toggleFirstLetterColor = () => {
    if (divRef.current) {
      const contentText = divRef.current.innerText.trim();
      if (isFirstLetterColored) {
        divRef.current.innerHTML = contentText;
        setIsFirstLetterColored(false);
      } else {
        const highlighted = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 0) {
              return `<span style="color: blue;">${word[0]}</span>${word.slice(1)}`;
            }
            return word;
          })
          .join(" ");
        divRef.current.innerHTML = highlighted;
        setIsFirstLetterColored(true);
      }
    }
  };

  // Toggle hiding remaining letters
  const toggleRemainingLettersOpacity = () => {
    if (divRef.current) {
      const contentText = divRef.current.innerText.trim();
      if (isRemainingLettersHidden) {
        const visibleText = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 1) {
              return `<span style="color: blue;">${word[0]}</span>${word.slice(1)}`;
            } else {
              return word;
            }
          })
          .join(" ");
        divRef.current.innerHTML = visibleText;
        setIsRemainingLettersHidden(false);
      } else {
        const modified = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 1) {
              return `<span style="color: blue;">${word[0]}</span><span style="opacity: 0;">${word.slice(1)}</span>`;
            } else {
              return word;
            }
          })
          .join(" ");
        divRef.current.innerHTML = modified;
        setIsRemainingLettersHidden(true);
      }
    }
  };

  // Adding content update listener for real-time tracking
  useEffect(() => {
    const handleInput = () => updateContent();
    if (divRef.current) {
      divRef.current.addEventListener("input", handleInput);
    }
    return () => divRef.current?.removeEventListener("input", handleInput);
  }, [divRef.current]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left Sidebar */}
      <div className="md:w-1/4 p-5 bg-gray-100 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleCourseSelect(course)}
            className={`block w-full p-3 mb-2 text-left rounded bg-gray-200 hover:bg-gray-300 ${
              selectedCourse === course ? "bg-gray-400" : ""
            }`}
          >
            {course.title}
          </button>
        ))}

        {/* Form to create new course */}
        <div className="mt-4 p-4 bg-gray-200 rounded">
          <h3 className="font-bold">Create New Course</h3>
          <input
            type="text"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Course Title"
            className="block w-full p-2 mt-2 mb-2 rounded border"
          />
          <textarea
            value={newCourseContent}
            onChange={(e) => setNewCourseContent(e.target.value)}
            placeholder="Course Content"
            className="block w-full p-2 mb-2 rounded border"
            rows={3}
          />
          <button
            onClick={handleCreateCourse}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:w-3/4 p-10 flex flex-col">
        <h1 className="text-3xl font-bold underline">
          {selectedCourse?.title || "Course Editor"}
        </h1>

        {/* Basic formatting buttons */}
        <div className="mt-4 mb-2 space-x-2">
          <button onClick={toggleFirstLetterColor} className="m-2 px-2 py-1 bg-gray-200 rounded">
            {isFirstLetterColored ? "Remove First Letter Color" : "Highlight First Letter"}
          </button>
          <button onClick={toggleRemainingLettersOpacity} className="m-2 px-2 py-1 bg-gray-200 rounded">
            {isRemainingLettersHidden ? "Show Remaining Letters" : "Hide Remaining Letters"}
          </button>
        </div>

        {/* Editable content area */}
        <div
          className={`w-full h-full p-5 text-xl font-medium border border-gray-300 ${inter.className}`}
          contentEditable
          ref={divRef}
          style={{ minHeight: "400px", overflowY: "auto" }}
        />

        {/* Display word count */}
        <div className="mt-4 text-gray-600">Word Count: {wordCount}</div>
      </div>
    </div>
  );
};

export default Page;
