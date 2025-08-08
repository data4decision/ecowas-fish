import React from "react";
import AdminLayout from "./AdminLayout";

export default function AdminHelp({ user }) {
  const sections = [
    {
      title: "1. Dashboard Overview",
      content: `
The Dashboard shows key metrics and indicators for monitoring fisheries data across countries.
- Navigation: Use the sidebar to switch between pages.
- Charts: View trends by country, indicator, and year.
- Play Trend: Click the play button to animate changes across time.
- Export: Export KPI trends as PDF for reporting.
      `,
    },
    {
      title: "2. Admin Upload",
      content: `
This section manages report submissions from users.
- This allow Admin to Upload a Document for all the countries and Admin can also select the country he/she want to send document to.
- If you want a specific information from all the ECOWAS countries, you can just prepare your File and then upload it for all the countries to know the specific information they are to provided.
- Admin can upload Excel Files, PDF, Document, and Images.
      `,
    },
     {
      title: "3. Admin Downloads",
      content: `
This section manages report submissions from users.
- Filter Reports: By status (Pending, Approved, All).
- Search by Title: Use the search bar for quick access.
- Preview Reports: Click Preview to open the file in a modal.
- Approve: Marks the file as approved and sends notifications.
- Reject: A confirmation modal will appear before rejecting.
- Download: Logs the file download into download history.
- Auto-Save: Approved reports are saved to the 'adminReports' collection.
      `,
    },
    {
      title: "4. Admin Report ",
      content: `
Displays all previously approved reports.
- Source: Data comes from the 'adminReports' collection.
- Includes: Title, Country, File URL, Approved By, Date.
- Purpose: Enables traceability of official reports across time.
      `,
    },
    {
      title: "5. Admin Download History",
      content: `
Logs every file downloaded by admin.
- Fields: Title, Country, Downloaded By, Date & Time.
- Source: Populated from AdminUpload downloads.
- Audit: Helps track admin interactions with files.
      `,
    },
    {
      title: "6. Notifications & Push Updates",
      content: `
- You will push Notification in Both English, French and Potuguese.
- Once the Message sent, It will automatically drop at the client Dashboard.
- The message will be available for the client in all the three Languages depending on the the language the user is using.
      `,
    },
    {
      title: "7. Help & Support",
      content: `
- Use: This Help page provides admin onboarding and instructions.
- Use: Reference this anytime you forget a flow.
- Feedback: Contact the development team for feature support or bug fixes.
      `,
    },
  ];

  return (
    <AdminLayout user={user}>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-[#0b0b5c] mb-4">Admin Help & Support</h2>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <details key={index} className="bg-white border rounded shadow-sm">
              <summary className="cursor-pointer px-4 py-2 font-medium text-[#0b0b5c] hover:bg-gray-100">
                {section.title}
              </summary>
              <div className="px-4 py-2 whitespace-pre-line text-gray-700">
                {section.content}
              </div>
            </details>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
