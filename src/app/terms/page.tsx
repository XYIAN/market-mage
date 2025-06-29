export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Terms & Privacy Policy</h1>
      <p className="mb-4">
        This application is provided by <strong>XYIAN Software</strong>. By
        using Market-Mage, you agree to the following terms and privacy policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Terms of Service</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Market-Mage is provided as-is, without warranty of any kind.</li>
        <li>
          Use of this application is at your own risk. XYIAN Software is not
          responsible for any financial losses or damages.
        </li>
        <li>
          All data and insights are for informational purposes only and do not
          constitute financial advice.
        </li>
        <li>Users must comply with all applicable laws and regulations.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">Privacy Policy</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          We respect your privacy and do not sell or share your personal
          information.
        </li>
        <li>
          Market-Mage may collect non-personal analytics data to improve the
          app.
        </li>
        <li>
          Third-party APIs and services are subject to their own privacy
          policies.
        </li>
        <li>For questions or concerns, contact support@xyian.com.</li>
      </ul>

      <p className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} XYIAN Software. All rights reserved.
      </p>
    </div>
  )
}
