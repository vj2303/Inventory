import React from 'react'
import Layout from '../../layout'
import CustomerTable from './CustomerTable'

const page = () => {
  return (
    <Layout title="Customer Management">
    <CustomerTable />
  </Layout>
  )
}

export default page