import React from 'react'
import BookingReport from './BookingReport'
import EmployeeReport from './EmployeeReport'
import { Separator } from '@/components/ui/separator'
import InventoryReport from './InventoryReport'

const AllTimeReport = () => {
  return (
    <div className="space-y-4">
        <BookingReport/>
        <Separator className='dark:bg-gray-700 dark:border-gray-600' />
        <EmployeeReport/>
        <Separator className='dark:bg-gray-700 dark:border-gray-600' />
        <InventoryReport/>
    </div>
  )
}

export default AllTimeReport