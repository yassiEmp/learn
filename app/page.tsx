"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const Page = () => {
  const div = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<string>('')
  const [wordCount, setWordCount] = useState<number>(0)
  const [isFirstLetterColored, setIsFirstLetterColored] = useState<boolean>(false)
  const [isRemainingLettersHidden, setIsRemainingLettersHidden] = useState<boolean>(false)
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [courses, setCourses] = useState<any[]>([])
  const [newCourseTitle, setNewCourseTitle] = useState<string>('')
  const [newCourseContent, setNewCourseContent] = useState<string>('')

  // Function to save courses to localStorage
  const saveCoursesToLocalStorage = (courses: any[]) => {
    localStorage.setItem('courses', JSON.stringify(courses))
  }

  // Load courses from localStorage on page load
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    }
  }, [])

  // Function to update content and word count
  const updateContent = () => {
    if (div.current) {
      const newContent = div.current.innerText
      setContent(newContent)
      setWordCount(newContent.trim().split(/\s+/).length)

      // Update content of selected course
      const updatedCourses = courses.map((course) =>
        course.title === selectedCourse ? { ...course, content: newContent } : course
      )
      setCourses(updatedCourses)

      // Save updated courses to localStorage
      saveCoursesToLocalStorage(updatedCourses)
    }
  }

  // Handle course selection
  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course.title)
    setContent(course.content)
    if (div.current) {
      div.current.innerText = course.content
    }
  }

  // Handle new course creation
  const handleCreateCourse = () => {
    if (newCourseTitle.trim() && newCourseContent.trim()) {
      const newCourse = {
        id: courses.length + 1,
        title: newCourseTitle,
        content: newCourseContent,
      }
      const updatedCourses = [...courses, newCourse]
      setCourses(updatedCourses)
      saveCoursesToLocalStorage(updatedCourses)
      setNewCourseTitle('')
      setNewCourseContent('')
    }
  }

  // Toggle first letter color
  const toggleFirstLetterColor = () => {
    if (div.current) {
      const contentText = div.current.innerText.trim()

      if (isFirstLetterColored) {
        div.current.innerHTML = contentText
        setIsFirstLetterColored(false)
      } else {
        const highlighted = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 0) {
              return `<span style="color: blue;">${word[0]}</span>${word.slice(1)}`
            }
            return word
          })
          .join(' ')
        div.current.innerHTML = highlighted
        setIsFirstLetterColored(true)
      }
    }
  }

  // Toggle hiding remaining letters
  const toggleRemainingLettersOpacity = () => {
    if (div.current) {
      const contentText = div.current.innerText.trim()

      if (isRemainingLettersHidden) {
        const visibleText = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 1) {
              return `<span style="color: blue;">${word[0]}</span>${word.slice(1)}`
            } else {
              return word
            }
          })
          .join(' ')
        div.current.innerHTML = visibleText
        setIsRemainingLettersHidden(false)
      } else {
        const modified = contentText
          .split(/\s+/)
          .map((word) => {
            if (word.length > 1) {
              return `<span style="color: blue;">${word[0]}</span><span style="opacity: 0;">${word.slice(1)}</span>`
            } else {
              return word
            }
          })
          .join(' ')
        div.current.innerHTML = modified
        setIsRemainingLettersHidden(true)
      }
    }
  }

  // Adding content update listener for real-time tracking
  useEffect(() => {
    if (div.current) {
      const handleInput = () => updateContent()
      div.current.addEventListener('input', handleInput)
      return () => div.current?.removeEventListener('input', handleInput)
    }
  }, [div.current])

  return (
    <div className="flex w-full h-full">
      {/* Left Sidebar */}
      <div className="w-1/4 p-5 bg-gray-100 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleCourseSelect(course)}
            className={`block w-full p-3 mb-2 text-left rounded bg-gray-200 hover:bg-gray-300 ${selectedCourse === course.title ? 'bg-gray-400' : ''}`}
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
          <button onClick={handleCreateCourse} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Course
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-3/4 p-10 flex flex-col">
        <h1 className="text-3xl font-bold underline">{selectedCourse || 'Course Editor'}</h1>

        {/* Basic formatting buttons */}
        <div className="mt-4 mb-2 space-x-2">
          <button onClick={toggleFirstLetterColor} className="px-2 py-1 bg-gray-200 rounded">
            {isFirstLetterColored ? 'Remove First Letter Color' : 'Highlight First Letter'}
          </button>
          <button onClick={toggleRemainingLettersOpacity} className="px-2 py-1 bg-gray-200 rounded">
            {isRemainingLettersHidden ? 'Show Remaining Letters' : 'Hide Remaining Letters'}
          </button>
        </div>

        {/* Editable content area */}
        <div
          className={`w-full h-full p-5 text-xl font-medium border border-gray-300 ${inter.className}`}
          contentEditable
          ref={div}
          style={{ minHeight: '400px', overflowY: 'auto' }}
        />

        {/* Display word count */}
        <div className="mt-4 text-gray-600">Word Count: {wordCount}</div>
      </div>
    </div>
  )
}

export default Page
