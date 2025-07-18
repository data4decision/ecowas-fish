// import React from 'react'
// import BeninDashboard from './countries/BeninDashboard'
// import NigeriaDashboard from './countries/NigeriaDashboard'

import CompareView from "../components/CompareView"
import CountryComparisonChart from "../components/CountryComparisonChart"
import DashboardWelcomeSection from "../components/DashboardWelcomeSection"

// const ClientDashboard = () => {
//   return (
//     <div><BeninDashboard/>
//     <NigeriaDashboard/>
//     </div>
//   )
// }

// export default ClientDashboard






const ClientDashboard = () => {
  return (
    <div>
    <DashboardWelcomeSection/>
    <CountryComparisonChart/>
    <CompareView/>
    </div>
  )
}

export default ClientDashboard