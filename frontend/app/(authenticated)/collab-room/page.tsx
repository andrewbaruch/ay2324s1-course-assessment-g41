"use client";

// pages/CollabRoomPage.tsx
import React from "react";
import { Question, QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";
import { Language } from "@/@types/language";
import CollabRoom from "@/components/collabRoom/CollabRoom";
import { Attempt } from "@/@types/attempt";

// Mock Data
const mockQuestions: Question[] = [
  {
    title: "FizzBuzz",
    id: "1",
    description:
      "Write a program that prints the numbers from 1 to 100. But for multiples of three print `Fizz` instead of the number and for the multiples of five print `Buzz`. For numbers which are multiples of both three and five print `FizzBuzz`.",
    categories: ["Array", "String"],
    complexity: QuestionComplexity.EASY,
  },
  {
    title: "Reverse String",
    id: "2",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`.",
    categories: ["String"],
    complexity: QuestionComplexity.EASY,
  },
  {
    title: "Two Sum",
    id: "3",
    description:
      "Given an array of integers `nums` and an integer `target`, return _indices_ of the two numbers such that they add up to `target`.",
    categories: ["Array", "Hash Table"],
    complexity: QuestionComplexity.MEDIUM,
  },
  // ... other questions
];

const mockUsers: User[] = [
  {
    id: "user1",
    email: "user1@example.com",
    image: null,
    name: "User One",
    preferred_language: "JavaScript",
    preferred_difficulty: 2,
    preferred_topics: null,
    roles: null,
  },
  {
    id: "user2",
    email: "user2@example.com",
    image: null,
    name: "User Two",
    preferred_language: "Python",
    preferred_difficulty: 2,
    preferred_topics: null,
    roles: null,
  },
  // ... other users
];

const mockLanguages: Language[] = [
  {
    id: "1",
    name: "JavaScript",
    slug: "javascript",
    description:
      "JavaScript is a high-level, often just-in-time compiled, and multi-paradigm programming language.",
  },
  {
    id: "2",
    name: "Python",
    slug: "python",
    description: "Python is an interpreted, high-level and general-purpose programming language.",
  },
  {
    id: "3",
    name: "Java",
    slug: "java",
    description:
      "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
  },
  // ... other languages
];

const mockAttempts: Attempt[] = [
  {
    attemptId: 1,
    codeText: "// Your code here",
    question: mockQuestions[0],
    language: mockLanguages[0],
  },
  {
    attemptId: 2,
    codeText: "// Your code here",
    question: mockQuestions[1],
    language: mockLanguages[1],
  },
  // ... other attempts
];

// Mock Handlers
const handleDeleteAttempt = (attemptId: number) => {
  console.log(`Delete attempt with id ${attemptId}`);
};

const handleCloseRoom = () => {
  console.log("Close room");
};

const handleNewAttempt = (questionId: string) => {
  console.log(`New attempt for question id ${questionId}`);
};

const handleCodeChange = (newCodeText: string, attemptId: number) => {
  console.log(`Code change for attempt id ${attemptId}: ${newCodeText}`);
};

const handleQuestionChange = (newQuestionId: string, attemptId: number) => {
  console.log(`Question change for attempt id ${attemptId}: ${newQuestionId}`);
};

const handleLanguageChange = (newLanguageId: string, attemptId: number) => {
  console.log(`Language change for attempt id ${attemptId}: Language ID ${newLanguageId}`);
};

// Usage
const CollabRoomPage: React.FC = () => {
  return (
    <CollabRoom
      questionTotalList={mockQuestions}
      languageTotalList={mockLanguages}
      listOfAttempts={mockAttempts}
      listOfActiveUsers={mockUsers}
      onDeleteAttempt={handleDeleteAttempt}
      onCloseRoom={handleCloseRoom}
      onNewAttempt={handleNewAttempt}
      onCodeChange={handleCodeChange}
      onQuestionChange={handleQuestionChange}
      onLanguageChange={handleLanguageChange}
    />
  );
};

export default CollabRoomPage;
