import express from "express";
import os from "os";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// -------------------------------------------------------------
// In-Memory Database / Persistent Data Layer with Realistic Seed Data
// -------------------------------------------------------------

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  targetRole: string;
  targetBatchId?: string;
  targetStudentId?: string;
  createdAt: string;
  readBy: string[];
}

const db: {
  users: any[];
  students: any[];
  credentials: any[];
  batches: any[];
  attendance: any[];
  homework: any[];
  submissions: any[];
  studyMaterials: any[];
  onlineClasses: any[];
  tests: any[];
  results: any[];
  feePayments: any[];
  notifications: NotificationItem[];
  gallery: any[];
  testimonials: any[];
  demoRegistrations: any[];
  admissionRequests: any[];
  enquiries: any[];
} = {
  credentials: [],
  users: [
    {
      id: "u_teacher",
      name: "Samba Siva Reddy Annem (SSR Sir)",
      email: "teacher@ssrtuition.com",
      role: "teacher",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "u_student_1",
      name: "Rahul Sharma",
      email: "student@ssrtuition.com",
      role: "student",
      phone: "+91 91234 56789",
      studentId: "s1001",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "u_parent_1",
      name: "Venkat Sharma",
      email: "parent@ssrtuition.com",
      role: "parent",
      phone: "+91 98111 22233",
      parentId: "p1001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ],

  students: [
    {
      id: "s1001",
      name: "Rahul Sharma",
      rollNo: "1001",
      class: "Class 10",
      board: "CBSE",
      batchId: "b_cbse_10",
      batchName: "Class 10 CBSE - Maths & Science",
      email: "student@ssrtuition.com",
      phone: "+91 91234 56789",
      parentName: "Venkat Sharma",
      parentEmail: "parent@ssrtuition.com",
      parentPhone: "+91 98111 22233",
      address: "H.No 4-12, Main Road, Hyderabad",
      joinDate: "2025-06-01",
      status: "active"
    },
    {
      id: "s1002",
      name: "Ananya Reddy",
      rollNo: "1002",
      class: "Class 10",
      board: "TG State Board",
      batchId: "b_tg_10",
      batchName: "Class 10 TG State Board - SSC Special",
      email: "ananya@ssrtuition.com",
      phone: "+91 98765 11111",
      parentName: "Srinivas Reddy",
      parentEmail: "srinivas@gmail.com",
      parentPhone: "+91 98765 22222",
      address: "Plot 45, Jubilee Hills, Hyderabad",
      joinDate: "2025-06-05",
      status: "active"
    },
    {
      id: "s1003",
      name: "Rohan Mukherjee",
      rollNo: "1003",
      class: "Class 10",
      board: "ICSE",
      batchId: "b_icse_10",
      batchName: "Class 10 ICSE - Physics & Maths Express",
      email: "rohan@ssrtuition.com",
      phone: "+91 98888 33344",
      parentName: "Amitabh Mukherjee",
      parentEmail: "amitabh@gmail.com",
      parentPhone: "+91 98888 33300",
      address: "Flat 402, Banjara Hills, Hyderabad",
      joinDate: "2025-06-08",
      status: "active"
    },
    {
      id: "s1004",
      name: "Bhavana Chowdary",
      rollNo: "1004",
      class: "Class 10",
      board: "AP State Board",
      batchId: "b_ap_10",
      batchName: "Class 10 AP State Board - SSC Toppers",
      email: "bhavana@ssrtuition.com",
      phone: "+91 97777 44455",
      parentName: "Nageswara Rao",
      parentEmail: "nagesh@gmail.com",
      parentPhone: "+91 97777 44400",
      address: "Door 12-4, Vijayawada Road, Guntur/Hyd",
      joinDate: "2025-06-12",
      status: "active"
    },
    {
      id: "s901",
      name: "Sai Karthik",
      rollNo: "901",
      class: "Class 9",
      board: "CBSE",
      batchId: "b_cbse_9",
      batchName: "Class 9 CBSE - Foundation Batch",
      email: "karthik@ssrtuition.com",
      phone: "+91 99887 76655",
      parentName: "Lakshmi Devi",
      parentEmail: "lakshmi@gmail.com",
      parentPhone: "+91 99887 76600",
      address: "Flat 201, SR Nagar, Hyderabad",
      joinDate: "2025-06-10",
      status: "active"
    },
    {
      id: "s801",
      name: "Divya Sri",
      rollNo: "801",
      class: "Class 8",
      board: "ICSE",
      batchId: "b_icse_8",
      batchName: "Class 8 ICSE - Evening Comprehensive",
      email: "divya@ssrtuition.com",
      phone: "+91 94400 11223",
      parentName: "Ramesh Rao",
      parentEmail: "ramesh@gmail.com",
      parentPhone: "+91 94400 11224",
      address: "Road No 3, Kukatpally, Hyderabad",
      joinDate: "2025-06-15",
      status: "active"
    },
    {
      id: "s701",
      name: "Teja Varma",
      rollNo: "701",
      class: "Class 7",
      board: "TG State Board",
      batchId: "b_tg_7",
      batchName: "Class 6-7 TG State - Special Care",
      email: "teja@ssrtuition.com",
      phone: "+91 97001 88990",
      parentName: "Subba Varma",
      parentEmail: "varma@gmail.com",
      parentPhone: "+91 97001 88991",
      address: "H.No 12-5, Ameerpet, Hyderabad",
      joinDate: "2025-07-01",
      status: "active"
    }
  ],

  batches: [
    {
      id: "b_cbse_10",
      name: "Class 10 CBSE - Maths & Science",
      class: "Class 10",
      board: "CBSE",
      subject: "Mathematics & Science",
      schedule: "Mon, Wed, Fri",
      time: "05:00 PM - 07:00 PM",
      maxStudents: 15,
      currentCount: 12
    },
    {
      id: "b_tg_10",
      name: "Class 10 TG State Board - SSC Special",
      class: "Class 10",
      board: "TG State Board",
      subject: "Maths, Science, Telugu & English",
      schedule: "Tue, Thu, Sat",
      time: "05:00 PM - 07:00 PM",
      maxStudents: 15,
      currentCount: 10
    },
    {
      id: "b_icse_10",
      name: "Class 10 ICSE - Physics & Maths Express",
      class: "Class 10",
      board: "ICSE",
      subject: "Mathematics & Physics",
      schedule: "Mon, Wed, Sat",
      time: "06:30 PM - 08:00 PM",
      maxStudents: 12,
      currentCount: 8
    },
    {
      id: "b_ap_10",
      name: "Class 10 AP State Board - SSC Toppers",
      class: "Class 10",
      board: "AP State Board",
      subject: "All Board Subjects",
      schedule: "Tue, Thu, Sun",
      time: "05:00 PM - 07:00 PM",
      maxStudents: 15,
      currentCount: 9
    },
    {
      id: "b_cbse_9",
      name: "Class 9 CBSE - Foundation Batch",
      class: "Class 9",
      board: "CBSE",
      subject: "Mathematics & Science",
      schedule: "Mon to Fri",
      time: "04:00 PM - 05:30 PM",
      maxStudents: 15,
      currentCount: 9
    },
    {
      id: "b_icse_8",
      name: "Class 8 ICSE - Evening Comprehensive",
      class: "Class 8",
      board: "ICSE",
      subject: "Maths, Science, English Grammar",
      schedule: "Mon, Wed, Fri",
      time: "06:00 PM - 07:30 PM",
      maxStudents: 12,
      currentCount: 8
    },
    {
      id: "b_tg_7",
      name: "Class 6-7 TG State - Special Care",
      class: "Class 7",
      board: "TG State Board",
      subject: "Maths, Science, Telugu & English",
      schedule: "Tue, Thu, Sat",
      time: "04:00 PM - 05:30 PM",
      maxStudents: 10,
      currentCount: 7
    }
  ],


  attendance: [
    { id: "att_1", studentId: "s1001", studentName: "Rahul Sharma", batchId: "b_cbse_10", date: "2026-07-30", status: "present", remarks: "Punctual" },
    { id: "att_2", studentId: "s1001", studentName: "Rahul Sharma", batchId: "b_cbse_10", date: "2026-07-28", status: "present", remarks: "Active participation" },
    { id: "att_3", studentId: "s1001", studentName: "Rahul Sharma", batchId: "b_cbse_10", date: "2026-07-25", status: "present", remarks: "" },
    { id: "att_4", studentId: "s1001", studentName: "Rahul Sharma", batchId: "b_cbse_10", date: "2026-07-23", status: "late", remarks: "10 mins late due to rain" },
    { id: "att_5", studentId: "s1001", studentName: "Rahul Sharma", batchId: "b_cbse_10", date: "2026-07-21", status: "present", remarks: "" },
    { id: "att_6", studentId: "s1002", studentName: "Ananya Reddy", batchId: "b_state_10", date: "2026-07-30", status: "present", remarks: "" },
    { id: "att_7", studentId: "s1002", studentName: "Ananya Reddy", batchId: "b_state_10", date: "2026-07-28", status: "absent", remarks: "Informed sick leave" },
    { id: "att_8", studentId: "s901", studentName: "Sai Karthik", batchId: "b_cbse_9", date: "2026-07-30", status: "present", remarks: "" }
  ],

  homework: [
    {
      id: "hw_1",
      title: "Quadratic Equations Exercise 4.2 & Word Problems",
      class: "Class 10",
      subject: "Mathematics",
      batchId: "b_cbse_10",
      batchName: "Class 10 CBSE - Maths & Science",
      dueDate: "2026-08-02",
      description: "Solve all problems from Exercise 4.2. Pay special attention to speed-distance-time word problems. Write step-by-step explanations.",
      fileName: "Class10_Maths_HW_Quadratic.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "1.2 MB",
      fileType: "application/pdf",
      createdAt: "2026-07-29"
    },
    {
      id: "hw_2",
      title: "Light: Reflection & Refraction Numerical Worksheet",
      class: "Class 10",
      subject: "Science",
      batchId: "b_cbse_10",
      batchName: "Class 10 CBSE - Maths & Science",
      dueDate: "2026-08-04",
      description: "Complete 10 numerical problems on mirror formula and refractive index. Draw neat ray diagrams.",
      fileName: "Physics_Light_Numericals.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "2.4 MB",
      fileType: "application/pdf",
      createdAt: "2026-07-30"
    },
    {
      id: "hw_3",
      title: "Polynomials Factorization Practice Sheet",
      class: "Class 9",
      subject: "Mathematics",
      batchId: "b_cbse_9",
      batchName: "Class 9 CBSE - Foundation Batch",
      dueDate: "2026-08-01",
      description: "Factorize 15 algebraic polynomials using factor theorem and identity formulas.",
      fileName: "Class9_Polynomials.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "850 KB",
      fileType: "application/pdf",
      createdAt: "2026-07-28"
    }
  ],

  submissions: [
    {
      id: "sub_1",
      homeworkId: "hw_1",
      homeworkTitle: "Quadratic Equations Exercise 4.2 & Word Problems",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      fileName: "Rahul_Sharma_Maths_HW1.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "1.8 MB",
      fileType: "application/pdf",
      submittedAt: "2026-07-30 18:45",
      marks: 18,
      maxMarks: 20,
      remarks: "Great work! Step-by-step presentation is neat. Double check question 4 calculation.",
      status: "graded"
    },
    {
      id: "sub_2",
      homeworkId: "hw_2",
      homeworkTitle: "Light: Reflection & Refraction Numerical Worksheet",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      fileName: "Rahul_Physics_Worksheet.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "2.1 MB",
      fileType: "application/pdf",
      submittedAt: "2026-07-31 08:15",
      marks: undefined,
      maxMarks: 20,
      remarks: undefined,
      status: "submitted"
    }
  ],

  studyMaterials: [
    {
      id: "sm_1",
      title: "Class 10 CBSE Maths Formula Sheet & Important Board Questions 2026",
      class: "Class 10",
      subject: "Mathematics",
      category: "PDF",
      fileName: "Class10_Maths_FormulaSheet.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "3.5 MB",
      uploadedAt: "2026-07-15"
    },
    {
      id: "sm_wiki_1",
      title: "Quadratic Equations - Complete Wikipedia Reference & Formula Proofs",
      class: "Class 10",
      subject: "Mathematics",
      category: "Notes",
      fileUrl: "https://en.wikipedia.org/wiki/Quadratic_equation",
      uploadedAt: "2026-07-28"
    },
    {
      id: "sm_wiki_2",
      title: "Refraction of Light & Snell's Law - Wikipedia Academic Reference",
      class: "Class 10",
      subject: "Science",
      category: "Notes",
      fileUrl: "https://en.wikipedia.org/wiki/Refraction",
      uploadedAt: "2026-07-29"
    },
    {
      id: "sm_2",
      title: "Class 10 Physics Ray Diagrams & Summary Notes",
      class: "Class 10",
      subject: "Science",
      category: "PDF",
      fileName: "Class10_Physics_RayDiagrams.pdf",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "4.1 MB",
      uploadedAt: "2026-07-20"
    },
    {
      id: "sm_wiki_3",
      title: "Polynomials & Algebraic Identities - Wikipedia Reference",
      class: "Class 9",
      subject: "Mathematics",
      category: "Notes",
      fileUrl: "https://en.wikipedia.org/wiki/Polynomial",
      uploadedAt: "2026-07-25"
    },
    {
      id: "sm_3",
      title: "Telugu Vyakaranam & Essay Writing Master Guide",
      class: "Class 10",
      subject: "Telugu",
      category: "Notes",
      fileName: "Telugu_Grammar_Guide.pdf",
      fileUrl: "https://en.wikipedia.org/wiki/Telugu_grammar",
      fileSize: "1.9 MB",
      uploadedAt: "2026-07-18"
    },
    {
      id: "sm_4",
      title: "Quadratic Equations Masterclass Video Lesson by SSR Sir",
      class: "Class 10",
      subject: "Mathematics",
      category: "Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      uploadedAt: "2026-07-22"
    }
  ],

  onlineClasses: [
    {
      id: "oc_1",
      title: "Class 10 Maths Special Doubts & Board Revision",
      subject: "Mathematics",
      class: "Class 10",
      batchId: "b_cbse_10",
      batchName: "Class 10 CBSE - Maths & Science",
      date: "2026-07-31",
      startTime: "18:00",
      endTime: "19:30",
      meetLink: "https://meet.google.com/ssr-tui-math",
      recordedVideoUrl: "",
      status: "upcoming"
    },
    {
      id: "oc_2",
      title: "Class 9 Science Physics Numericals Workshop",
      subject: "Science",
      class: "Class 9",
      batchId: "b_cbse_9",
      batchName: "Class 9 CBSE - Foundation Batch",
      date: "2026-08-01",
      startTime: "17:00",
      endTime: "18:30",
      meetLink: "https://meet.google.com/ssr-sci-rev",
      recordedVideoUrl: "",
      status: "upcoming"
    },
    {
      id: "oc_3",
      title: "Quadratic Equations Concepts & Shortcuts (Recorded)",
      subject: "Mathematics",
      class: "Class 10",
      batchId: "b_cbse_10",
      batchName: "Class 10 CBSE - Maths & Science",
      date: "2026-07-27",
      startTime: "18:00",
      endTime: "19:30",
      meetLink: "https://meet.google.com/ssr-prev-class",
      recordedVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      status: "completed"
    }
  ],

  tests: [
    {
      id: "t_1",
      title: "Weekly Test 4 - Quadratic Equations",
      type: "weekly",
      class: "Class 10",
      subject: "Mathematics",
      batchId: "b_cbse_10",
      date: "2026-07-26",
      maxMarks: 50
    },
    {
      id: "t_2",
      title: "Daily Practice Test - Chemical Reactions",
      type: "daily",
      class: "Class 10",
      subject: "Science",
      batchId: "b_cbse_10",
      date: "2026-07-24",
      maxMarks: 20
    },
    {
      id: "t_3",
      title: "Weekly Test 3 - Triangles & Trigonometry Basics",
      type: "weekly",
      class: "Class 10",
      subject: "Mathematics",
      batchId: "b_cbse_10",
      date: "2026-07-19",
      maxMarks: 50
    }
  ],

  results: [
    {
      id: "res_1",
      testId: "t_1",
      testTitle: "Weekly Test 4 - Quadratic Equations",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      marksObtained: 47,
      maxMarks: 50,
      percentage: 94,
      grade: "A+",
      remarks: "Top score in batch! Outstanding accuracy.",
      date: "2026-07-26"
    },
    {
      id: "res_2",
      testId: "t_2",
      testTitle: "Daily Practice Test - Chemical Reactions",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      marksObtained: 19,
      maxMarks: 20,
      percentage: 95,
      grade: "A+",
      remarks: "Very clear balancing equations.",
      date: "2026-07-24"
    },
    {
      id: "res_3",
      testId: "t_3",
      testTitle: "Weekly Test 3 - Triangles & Trigonometry Basics",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      marksObtained: 44,
      maxMarks: 50,
      percentage: 88,
      grade: "A",
      remarks: "Revise proofs theorem once.",
      date: "2026-07-19"
    },
    {
      id: "res_4",
      testId: "t_1",
      testTitle: "Weekly Test 4 - Quadratic Equations",
      studentId: "s1002",
      studentName: "Ananya Reddy",
      marksObtained: 43,
      maxMarks: 50,
      percentage: 86,
      grade: "A",
      remarks: "Good effort! Practice word problems more.",
      date: "2026-07-26"
    }
  ],

  feePayments: [
    {
      id: "fee_jul_1001",
      receiptNo: "REC-2026-07-1001",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      class: "Class 10",
      month: "July 2026",
      amount: 2500,
      paymentDate: "2026-07-05",
      paymentMethod: "Razorpay",
      razorpayPaymentId: "pay_Nzk281239101",
      status: "paid",
      dueDate: "2026-07-10"
    },
    {
      id: "fee_aug_1001",
      receiptNo: "REC-2026-08-1001",
      studentId: "s1001",
      studentName: "Rahul Sharma",
      class: "Class 10",
      month: "August 2026",
      amount: 2500,
      status: "pending",
      dueDate: "2026-08-10"
    },
    {
      id: "fee_jul_1002",
      receiptNo: "REC-2026-07-1002",
      studentId: "s1002",
      studentName: "Ananya Reddy",
      class: "Class 10",
      month: "July 2026",
      amount: 2500,
      paymentDate: "2026-07-08",
      paymentMethod: "UPI",
      razorpayPaymentId: "pay_Nzk281239102",
      status: "paid",
      dueDate: "2026-07-10"
    },
    {
      id: "fee_aug_1002",
      receiptNo: "REC-2026-08-1002",
      studentId: "s1002",
      studentName: "Ananya Reddy",
      class: "Class 10",
      month: "August 2026",
      amount: 2500,
      status: "pending",
      dueDate: "2026-08-10"
    },
    {
      id: "fee_jul_901",
      receiptNo: "REC-2026-07-901",
      studentId: "s901",
      studentName: "Sai Karthik",
      class: "Class 9",
      month: "July 2026",
      amount: 2200,
      paymentDate: "2026-07-04",
      paymentMethod: "Card",
      razorpayPaymentId: "pay_Nzk281239103",
      status: "paid",
      dueDate: "2026-07-10"
    }
  ],

  notifications: [
    {
      id: "notif_1",
      title: "Class 10 Maths Special Revision Session",
      message: "Join SSR Sir live today at 6:00 PM for Quadratic Equations board questions and doubts.",
      type: "class",
      targetRole: "all",
      createdAt: "2026-07-31 09:00",
      readBy: []
    },
    {
      id: "notif_2",
      title: "Weekly Test 4 Results Uploaded",
      message: "Weekly Test 4 (Quadratic Equations) marks and teacher feedback are now available in your results portal.",
      type: "test",
      targetRole: "all",
      createdAt: "2026-07-27 10:30",
      readBy: ["u_student_1"]
    },
    {
      id: "notif_3",
      title: "August 2026 Fee Invoice Generated",
      message: "Monthly tuition fee for August 2026 is due by 10th August. Pay online securely via Razorpay.",
      type: "fee",
      targetRole: "parent",
      createdAt: "2026-07-30 11:00",
      readBy: []
    }
  ],

  gallery: [
    {
      id: "gal_1",
      title: "Small Batch Dedicated Classroom",
      category: "Classroom",
      imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
      caption: "Maximum 15 students per batch for individual focus by SSR Sir."
    },
    {
      id: "gal_2",
      title: "CBSE & State Board Toppers 2025",
      category: "Toppers",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      caption: "Our students scored 98% in Maths & Science board examinations."
    },
    {
      id: "gal_3",
      title: "Interactive Science Model Exhibition",
      category: "Events",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
      caption: "Hands-on learning and practical physics experiments at SSR Tuition."
    },
    {
      id: "gal_4",
      title: "Telugu & English Medium Explanation Care Session",
      category: "Classroom",
      imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
      caption: "Special care and clear concept building in both Telugu and English."
    }
  ],

  testimonials: [
    {
      id: "test_1",
      name: "Srinivas Reddy",
      role: "Parent",
      batch: "Parent of Ananya (Class 10)",
      content: "SSR Sir's personal attention changed my daughter's score from 65% to 92% in Maths! The small batch size and daily homework checking really make a difference.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "test_2",
      name: "Rahul Sharma",
      role: "Student",
      batch: "Class 10 CBSE",
      content: "SSR Sir explains complex Physics numerics and Maths formulas in very simple Telugu and English. Weekly tests prepared me completely for the board exam!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "test_3",
      name: "Lakshmi Devi",
      role: "Parent",
      batch: "Parent of Sai Karthik (Class 9)",
      content: "Parent updates on WhatsApp and online portal keep us informed every week. Best tuition in Hyderabad for CBSE and State Board!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    }
  ],

  demoRegistrations: [],
  admissionRequests: [],
  enquiries: []
};

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "SSR Tuition Management System" });
});

// Users & Auth Mock (handed by main credentials login route)

// Students
app.get("/api/students", (req, res) => {
  res.json(db.students);
});

app.post("/api/students", (req, res) => {
  const newStudent = {
    id: `s${Date.now().toString().slice(-4)}`,
    rollNo: (1000 + db.students.length + 1).toString(),
    status: "active",
    joinDate: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.students.push(newStudent);
  createStudentAndParentCredentials(newStudent);
  res.json({ success: true, student: newStudent });
});

app.patch("/api/students/:id", (req, res) => {
  const student = db.students.find((item) => item.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, error: "Student not found." });
  }

  const updatableFields = [
    'name',
    'email',
    'phone',
    'parentName',
    'parentEmail',
    'parentPhone',
    'address'
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  db.credentials.forEach((cred) => {
    if (cred.role === 'student' && cred.studentId === student.id) {
      if (req.body.name !== undefined) cred.name = req.body.name;
      if (req.body.email !== undefined) cred.email = req.body.email;
      if (req.body.class !== undefined) cred.class = req.body.class;
      if (req.body.board !== undefined) cred.board = req.body.board;
      cred.lastUpdated = new Date().toISOString().split('T')[0];
    }

    if (cred.role === 'parent' && cred.studentId === student.id) {
      if (req.body.parentName !== undefined) cred.name = req.body.parentName;
      if (req.body.parentEmail !== undefined) cred.email = req.body.parentEmail;
      if (req.body.parentPhone !== undefined) cred.phone = req.body.parentPhone;
      if (req.body.name !== undefined) cred.studentName = req.body.name;
      cred.lastUpdated = new Date().toISOString().split('T')[0];
    }
  });

  syncCredentialsFile();

  res.json({ success: true, student });
});

app.post("/api/admission-requests/:id/approve", (req, res) => {
  const admission = db.admissionRequests.find(a => a.id === req.params.id);
  if (!admission) {
    return res.status(404).json({ success: false, error: "Admission request not found." });
  }
  if (admission.status === 'approved') {
    return res.json({ success: true, admission });
  }
  admission.status = 'approved';
  const student = convertAdmissionToStudent(admission);
  res.json({ success: true, admission, student });
});

app.post("/api/admission-requests/:id/reject", (req, res) => {
  const admission = db.admissionRequests.find(a => a.id === req.params.id);
  if (!admission) {
    return res.status(404).json({ success: false, error: "Admission request not found." });
  }
  admission.status = 'rejected';
  res.json({ success: true, admission });
});

app.post("/api/demo-requests/:id/confirm", (req, res) => {
  const demo = db.demoRegistrations.find(d => d.id === req.params.id);
  if (!demo) {
    return res.status(404).json({ success: false, error: "Demo request not found." });
  }
  demo.status = 'contacted';
  res.json({ success: true, demo });
});

// Batches
app.get("/api/batches", (req, res) => {
  res.json(db.batches);
});

app.post("/api/batches", (req, res) => {
  const newBatch = {
    id: `b_${Date.now().toString().slice(-4)}`,
    currentCount: 0,
    ...req.body
  };
  db.batches.push(newBatch);
  res.json({ success: true, batch: newBatch });
});

// Attendance
app.get("/api/attendance", (req, res) => {
  const { batchId, date, studentId } = req.query;
  let list = db.attendance;
  if (batchId) list = list.filter(a => a.batchId === batchId);
  if (date) list = list.filter(a => a.date === date);
  if (studentId) list = list.filter(a => a.studentId === studentId);
  res.json(list);
});

app.post("/api/attendance", (req, res) => {
  const { records } = req.body; // array of records
  if (Array.isArray(records)) {
    records.forEach(rec => {
      const idx = db.attendance.findIndex(a => a.studentId === rec.studentId && a.date === rec.date);
      if (idx >= 0) {
        db.attendance[idx] = { ...db.attendance[idx], ...rec };
      } else {
        db.attendance.push({
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          ...rec
        });
      }
    });
  }
  res.json({ success: true, count: records ? records.length : 0 });
});

// Homework
app.get("/api/homework", (req, res) => {
  const { batchId, studentId } = req.query;
  let list = db.homework;
  if (batchId) list = list.filter(h => h.batchId === batchId);
  res.json(list);
});

app.post("/api/homework", (req, res) => {
  const hw = {
    id: `hw_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.homework.unshift(hw);

  // Auto notify students
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: `New Homework: ${hw.title}`,
    message: `${hw.subject} homework assigned for ${hw.batchName}. Due date: ${hw.dueDate}`,
    type: "homework",
    targetRole: "student",
    targetBatchId: hw.batchId,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    readBy: []
  });

  res.json({ success: true, homework: hw });
});

// Homework Submissions
app.get("/api/homework-submissions", (req, res) => {
  const { homeworkId, studentId } = req.query;
  let list = db.submissions;
  if (homeworkId) list = list.filter(s => s.homeworkId === homeworkId);
  if (studentId) list = list.filter(s => s.studentId === studentId);
  res.json(list);
});

app.post("/api/homework-submissions", (req, res) => {
  const { homeworkId, studentId, studentName, fileName, fileUrl, fileSize, fileType } = req.body;
  const homework = db.homework.find(h => h.id === homeworkId);

  const existingIdx = db.submissions.findIndex(s => s.homeworkId === homeworkId && s.studentId === studentId);
  const sub = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : `sub_${Date.now()}`,
    homeworkId,
    homeworkTitle: homework ? homework.title : "Homework Submission",
    studentId,
    studentName,
    fileName: fileName || "submission.pdf",
    fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: fileSize || "1.5 MB",
    fileType: fileType || "application/pdf",
    submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    status: "submitted",
    marks: existingIdx >= 0 ? db.submissions[existingIdx].marks : undefined,
    maxMarks: 20,
    remarks: existingIdx >= 0 ? db.submissions[existingIdx].remarks : undefined
  };

  if (existingIdx >= 0) {
    db.submissions[existingIdx] = sub;
  } else {
    db.submissions.unshift(sub);
  }

  res.json({ success: true, submission: sub });
});

app.put("/api/homework-submissions/:id/grade", (req, res) => {
  const { id } = req.params;
  const { marks, remarks } = req.body;
  const sub = db.submissions.find(s => s.id === id);
  if (sub) {
    sub.marks = Number(marks);
    sub.remarks = remarks;
    sub.status = "graded";

    // Notify student/parent
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: `Homework Graded: ${sub.homeworkTitle}`,
      message: `Teacher gave ${marks} marks. Remarks: ${remarks || "Good job!"}`,
      type: "homework",
      targetRole: "student",
      targetStudentId: sub.studentId,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      readBy: []
    });

    res.json({ success: true, submission: sub });
  } else {
    res.status(404).json({ error: "Submission not found" });
  }
});

// Study Materials
app.get("/api/study-materials", (req, res) => {
  res.json(db.studyMaterials);
});

app.post("/api/study-materials", (req, res) => {
  const sm = {
    id: `sm_${Date.now()}`,
    uploadedAt: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.studyMaterials.unshift(sm);
  res.json({ success: true, material: sm });
});

// Online Classes
app.get("/api/online-classes", (req, res) => {
  res.json(db.onlineClasses);
});

app.post("/api/online-classes", (req, res) => {
  const oc = {
    id: `oc_${Date.now()}`,
    status: "upcoming",
    ...req.body
  };
  db.onlineClasses.unshift(oc);

  // Notify batch
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: `Google Meet Scheduled: ${oc.title}`,
    message: `Subject: ${oc.subject}. Time: ${oc.date} ${oc.startTime}. Click to join.`,
    type: "class",
    targetRole: "all",
    targetBatchId: oc.batchId,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    readBy: []
  });

  res.json({ success: true, onlineClass: oc });
});

// Tests & Results
app.get("/api/tests", (req, res) => {
  res.json(db.tests);
});

app.post("/api/tests", (req, res) => {
  const t = {
    id: `t_${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.tests.unshift(t);
  res.json({ success: true, test: t });
});

app.get("/api/results", (req, res) => {
  const { studentId } = req.query;
  let list = db.results;
  if (studentId) list = list.filter(r => r.studentId === studentId);
  res.json(list);
});

app.post("/api/results", (req, res) => {
  const {
    testId,
    title,
    subject,
    class: studentClass,
    studentId,
    studentName,
    marksObtained,
    maxMarks,
    remarks
  } = req.body;
  const percentage = Math.round((marksObtained / maxMarks) * 100);
  let grade = "C";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";

  const resObj = {
    id: `res_${Date.now()}_${studentId}`,
    testId,
    title,
    subject: subject || "General",
    class: studentClass || "Class 10",
    studentId,
    studentName,
    marksObtained: Number(marksObtained),
    maxMarks: Number(maxMarks),
    percentage,
    grade,
    remarks,
    date: new Date().toISOString().split("T")[0]
  };

  db.results.unshift(resObj);
  res.json({ success: true, result: resObj });
});

app.get("/api/test-results", (req, res) => {
  const { studentId } = req.query;
  let list = db.results;
  if (studentId) list = list.filter(r => r.studentId === studentId);
  res.json(list);
});

app.post("/api/test-results", (req, res) => {
  const {
    testId,
    title,
    subject,
    class: studentClass,
    studentId,
    studentName,
    marksObtained,
    maxMarks,
    remarks
  } = req.body;
  const percentage = Math.round((marksObtained / maxMarks) * 100);
  let grade = "C";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";

  const resObj = {
    id: `res_${Date.now()}_${studentId}`,
    testId,
    title,
    subject: subject || "General",
    class: studentClass || "Class 10",
    studentId,
    studentName,
    marksObtained: Number(marksObtained),
    maxMarks: Number(maxMarks),
    percentage,
    grade,
    remarks,
    date: new Date().toISOString().split("T")[0]
  };

  db.results.unshift(resObj);
  res.json({ success: true, result: resObj });
});

app.get("/api/admission-requests", (req, res) => {
  res.json(db.admissionRequests);
});

app.get("/api/demo-requests", (req, res) => {
  res.json(db.demoRegistrations);
});

app.get("/api/enquiries", (req, res) => {
  res.json(db.enquiries);
});

// Fee Payments & Razorpay
app.get("/api/fees", (req, res) => {
  const { studentId } = req.query;
  let list = db.feePayments;
  if (studentId) list = list.filter(f => f.studentId === studentId);
  res.json(list);
});

app.post("/api/fees/pay", (req, res) => {
  const { feeId, razorpayPaymentId, paymentMethod } = req.body;
  const fee = db.feePayments.find(f => f.id === feeId);

  if (fee) {
    fee.status = "paid";
    fee.paymentDate = new Date().toISOString().split("T")[0];
    fee.paymentMethod = paymentMethod || "Razorpay";
    fee.razorpayPaymentId = razorpayPaymentId || `pay_${Date.now()}`;

    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: `Fee Payment Successful: ${fee.month}`,
      message: `Receipt ${fee.receiptNo} generated for ₹${fee.amount}. Thank you!`,
      type: "fee",
      targetRole: "parent",
      targetStudentId: fee.studentId,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      readBy: []
    });

    res.json({ success: true, fee });
  } else {
    res.status(404).json({ error: "Fee record not found" });
  }
});

// Notifications
app.get("/api/notifications", (req, res) => {
  res.json(db.notifications);
});

app.delete("/api/notifications/:id", (req, res) => {
  const { id } = req.params;
  db.notifications = db.notifications.filter(n => n.id !== id);
  res.json({ success: true, notifications: db.notifications });
});

app.post("/api/notifications/clear-all", (req, res) => {
  db.notifications = [];
  res.json({ success: true, notifications: [] });
});

// Gallery & Testimonials
app.get("/api/gallery", (req, res) => {
  res.json(db.gallery);
});

app.post("/api/gallery", (req, res) => {
  const item = { id: `gal_${Date.now()}`, ...req.body };
  db.gallery.unshift(item);
  res.json({ success: true, item });
});

app.get("/api/testimonials", (req, res) => {
  res.json(db.testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const test = { id: `test_${Date.now()}`, ...req.body };
  db.testimonials.unshift(test);
  res.json({ success: true, testimonial: test });
});

// Registrations & Enquiries
app.post("/api/demo-registration", (req, res) => {
  const demo = {
    id: `demo_${Date.now()}`,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.demoRegistrations.unshift(demo);
  res.json({ success: true, message: "Free Demo request received! SSR Sir will contact you shortly.", demo });
});

app.post("/api/admission", (req, res) => {
  const adm = {
    id: `adm_${Date.now()}`,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.admissionRequests.unshift(adm);
  res.json({ success: true, message: "Online Admission application submitted successfully!", admission: adm });
});

app.post("/api/contact", (req, res) => {
  const enq = {
    id: `enq_${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    ...req.body
  };
  db.enquiries.unshift(enq);
  res.json({ success: true, message: "Thank you for contacting SSR Tuition! We will get back to you soon.", enquiry: enq });
});

// -------------------------------------------------------------
// Dynamic Credentials Generator & credentials.txt Syncer
// -------------------------------------------------------------
function initializeCredentialsAndStudents() {
  const boards = [
    'CBSE', 'ICSE', 'TG State Board', 'AP State Board',
    'Karnataka SSLC', 'Maharashtra SSC', 'Tamil Nadu State Board',
    'IGCSE', 'IB', 'NIOS'
  ];

  // Clear previous credentials and students to ensure fresh 50 student/parent setup
  db.students = [];
  db.credentials = [
    {
      id: "c_teacher",
      role: "teacher",
      name: "Samba Siva Reddy Annem",
      email: "teacher@ssrtuition.com",
      phone: "+91 98765 43210",
      username: "Dinesh_A",
      password: "Dinesh@1",
      lastUpdated: new Date().toISOString().split("T")[0]
    }
  ];

  // Generate 50 Students and 50 Parents with valid credentials (min 10 characters for username & password)
  for (let i = 1; i <= 50; i++) {
    const sIdxStr = String(i).padStart(2, '0');
    const sId = `s${1000 + i}`;
    const pId = `p${1000 + i}`;
    const rollNo = `${1000 + i}`;
    const board = boards[(i - 1) % boards.length];
    const sClass = `Class ${6 + ((i - 1) % 5)}`;
    
    // Student and Parent credentials between 8 and 10 characters
    const studentUsername = `student${sIdxStr}`;  // e.g. student01 (9 chars)
    const studentPassword = `stdpass${sIdxStr}`;  // e.g. stdpass01 (9 chars)

    const parentUsername = `parent_${sIdxStr}`;  // e.g. parent_01 (9 chars)
    const parentPassword = `prnpass${sIdxStr}`;  // e.g. prnpass01 (9 chars)

    const sName = `Student ${sIdxStr}`;
    const pName = `Parent ${sIdxStr}`;

    db.students.push({
      id: sId,
      name: sName,
      rollNo,
      class: sClass,
      board,
      batchId: `b_${board.toLowerCase().replace(/\s+/g, '_')}_${sClass.replace(/\s+/g, '').toLowerCase()}`,
      batchName: `${sClass} ${board} - Comprehensive`,
      email: `${studentUsername}@ssrtuition.com`,
      phone: `+91 98${String(1000000 + i * 333).substring(0, 8)}`,
      parentName: pName,
      parentEmail: `${parentUsername}@gmail.com`,
      parentPhone: `+91 99${String(2000000 + i * 444).substring(0, 8)}`,
      address: `Flat ${100 + i}, Hyderabad / AP Region`,
      joinDate: "2025-06-01",
      status: "active"
    });

    db.credentials.push({
      id: `c_std_${sId}`,
      role: "student",
      studentId: sId,
      rollNo,
      name: sName,
      class: sClass,
      board,
      username: studentUsername,
      password: studentPassword,
      lastUpdated: new Date().toISOString().split("T")[0]
    });

    db.credentials.push({
      id: `c_prn_${pId}`,
      role: "parent",
      parentId: pId,
      studentId: sId,
      studentName: sName,
      name: pName,
      username: parentUsername,
      password: parentPassword,
      lastUpdated: new Date().toISOString().split("T")[0]
    });
  }

  syncCredentialsFile();
}

function syncCredentialsFile() {
  const filePath = path.join(process.cwd(), 'credentials.txt');
  let text = `================================================================================\n`;
  text += `SSR TUITION CLASSES (CLASSES 1-10) - MASTER CREDENTIALS DIRECTORY\n`;
  text += `================================================================================\n`;
  text += `Teacher & Founder: Samba Siva Reddy Annem | SSR Tuition Single-Teacher Excellence\n`;
  text += `Supported Boards: CBSE | ICSE | TG State Board | AP State Board | Karnataka SSLC\n`;
  text += `                  Maharashtra SSC | Tamil Nadu State Board | IGCSE | IB | NIOS\n`;
  text += `--------------------------------------------------------------------------------\n`;
  text += `TEACHER CREDENTIALS: Username: Dinesh_A | Password: Dinesh@1\n`;
  text += `STUDENT CREDENTIALS (50 STUDENTS): student01 to student50 | Pass: stdpass01 to stdpass50 (8-10 chars)\n`;
  text += `PARENT CREDENTIALS (50 PARENTS)  : parent_01 to parent_50 | Pass: prnpass01 to prnpass50 (8-10 chars)\n`;
  text += `================================================================================\n\n`;

  text += `--- 1. TEACHER CREDENTIALS ---\n`;
  const teacherCred = db.credentials.find(c => c.role === 'teacher');
  if (teacherCred) {
    text += `[TEACHER] | Username: ${teacherCred.username} | Password: ${teacherCred.password} | Name: ${teacherCred.name}\n\n`;
  }

  text += `--- 2. STUDENT CREDENTIALS (50 STUDENTS) ---\n`;
  const studentCreds = db.credentials.filter(c => c.role === 'student');
  studentCreds.forEach((c, idx) => {
    text += `[STUDENT #${String(idx + 1).padStart(2, '0')}] | Roll: ${c.rollNo} | Username: ${c.username.padEnd(12, ' ')} | Password: ${c.password.padEnd(12, ' ')} | Board: ${c.board}\n`;
  });

  text += `\n--- 3. PARENT CREDENTIALS (50 PARENTS) ---\n`;
  const parentCreds = db.credentials.filter(c => c.role === 'parent');
  parentCreds.forEach((c, idx) => {
    text += `[PARENT #${String(idx + 1).padStart(2, '0')}] | Parent ID: ${c.parentId} | Username: ${c.username.padEnd(12, ' ')} | Password: ${c.password.padEnd(12, ' ')} | Child: ${c.studentName}\n`;
  });

  try {
    fs.writeFileSync(filePath, text, 'utf-8');
    console.log(`[Credentials] Synchronized ${db.credentials.length} credentials to credentials.txt`);
  } catch (err) {
    console.error(`[Credentials] Sync error:`, err);
  }
}

function createStudentAndParentCredentials(student: any) {
  const suffix = student.rollNo.slice(-2);
  const studentUsername = `student${suffix}`;
  const studentPassword = `stdpass${suffix}`;
  const parentUsername = `parent_${suffix}`;
  const parentPassword = `prnpass${suffix}`;

  const studentCredential = {
    id: `c_std_${student.id}`,
    role: 'student',
    studentId: student.id,
    rollNo: student.rollNo,
    name: student.name,
    class: student.class,
    board: student.board,
    username: studentUsername,
    password: studentPassword,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const parentCredential = {
    id: `c_prn_p${student.rollNo}`,
    role: 'parent',
    parentId: `p${student.rollNo}`,
    studentId: student.id,
    studentName: student.name,
    name: student.parentName || `Parent ${student.name}`,
    username: parentUsername,
    password: parentPassword,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  db.credentials.push(studentCredential, parentCredential);
  syncCredentialsFile();
  return { studentCredential, parentCredential };
}

function convertAdmissionToStudent(admission: any) {
  const newStudent = {
    id: `s${Date.now().toString().slice(-4)}`,
    rollNo: (1000 + db.students.length + 1).toString(),
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    name: admission.studentName,
    class: admission.class,
    board: admission.board,
    batchId: `b_${admission.board.toLowerCase().replace(/\s+/g, '_')}_${admission.class.replace(/\s+/g, '').toLowerCase()}`,
    batchName: `${admission.class} ${admission.board} - Admission Batch`,
    email: admission.email,
    phone: admission.phone,
    parentName: admission.parentName,
    parentEmail: admission.parentEmail || admission.email,
    parentPhone: admission.phone,
    address: admission.address,
  };

  db.students.push(newStudent);
  createStudentAndParentCredentials(newStudent);
  return newStudent;
}

// Auth & Credentials API Endpoints
app.post("/api/auth/login", (req, res) => {
  const { username, email, password, role } = req.body;
  const inputStr = (username || email || "").trim().toLowerCase();
  const pwdStr = (password || "").trim();

  const match = db.credentials.find(c => {
    const normUser = c.username.toLowerCase();
    const altUser1 = normUser.replace('_', '');
    const altUser2 = normUser.includes('parent') ? normUser.replace('parent_', 'parent') : normUser;

    const userMatch =
      normUser === inputStr ||
      altUser1 === inputStr ||
      altUser2 === inputStr ||
      (c.email && c.email.toLowerCase() === inputStr) ||
      (c.studentId && c.studentId.toLowerCase() === inputStr);

    const roleMatch = !role || c.role === role;

    const normDigits = c.username.replace(/\D/g, '');
    const allowedPasswords = [
      c.password,
      `stdpass${normDigits}`,
      `prnpass${normDigits}`,
      `student@${normDigits}`,
      `parent@${normDigits}`,
      `stdpass0${normDigits}`,
      `prnpass0${normDigits}`
    ];

    const pwdMatch = pwdStr && allowedPasswords.includes(pwdStr);
    return userMatch && roleMatch && pwdMatch;
  });

  if (match) {
    let userObj: any = {
      id: match.id,
      name: match.name,
      email: match.email || `${match.username}@ssrtuition.com`,
      role: match.role,
      phone: match.phone || "+91 98765 43210"
    };

    if (match.role === 'student') {
      userObj.studentId = match.studentId;
      userObj.board = match.board;
      userObj.class = match.class;
    } else if (match.role === 'parent') {
      userObj.parentId = match.parentId;
      userObj.studentId = match.studentId;
    }

    res.json({ success: true, user: userObj });
  } else {
    res.status(401).json({ error: "Invalid username, password or portal role. Check credentials.txt or ask SSR Sir." });
  }
});

app.get("/api/credentials", (req, res) => {
  res.json(db.credentials);
});

app.post("/api/credentials/update", (req, res) => {
  const { id, username, password } = req.body;
  const cred = db.credentials.find(c => c.id === id);

  if (!cred) {
    return res.status(404).json({ error: "Credential record not found" });
  }

  if (username) cred.username = username.trim();
  if (password) cred.password = password.trim();
  cred.lastUpdated = new Date().toISOString().split("T")[0];

  syncCredentialsFile();

  res.json({ success: true, credential: cred });
});

app.get("/api/credentials/file", (req, res) => {
  const filePath = path.join(process.cwd(), 'credentials.txt');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(filePath);
  } else {
    res.status(404).send("credentials.txt file not found");
  }
});

app.get("/credentials.txt", (req, res) => {
  const filePath = path.join(process.cwd(), 'credentials.txt');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(filePath);
  } else {
    res.status(404).send("credentials.txt file not found");
  }
});

// -------------------------------------------------------------
// Vite Middleware / Production Server Setup
// -------------------------------------------------------------
async function startServer() {
  initializeCredentialsAndStudents();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`SSR Tuition Management System server running at http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);

    if (HOST === "0.0.0.0") {
      const interfaces = os.networkInterfaces();
      Object.values(interfaces).forEach((iface) => {
        iface?.forEach((addr) => {
          if (addr.family === "IPv4" && !addr.internal) {
            console.log(`Accessible on: http://${addr.address}:${PORT}`);
          }
        });
      });
    }
  });
}

startServer();
