import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import AddNewCatagory from "@/app/(component)/Inventory/AddNewCatagory";
import AddNewInventory from "@/app/(component)/Inventory/AddNewInventory";
import AddNewSupplier from "@/app/(component)/Inventory/AddNewSupplier";
import {
  getAllCategories,
  getAllInventory,
 
} from "@/app/actions/inventoryActions";
import { DataTable } from "@/app/(component)/Inventory/inventory_table";
import { colums } from "@/app/(component)/Inventory/inventory_table_colums";
import InventoryReceivingForm from "@/app/(component)/Inventory/InventoryReceivingForm";
import { auth } from "@/lib/auth";
import { User } from "@/types/type";


const page = async () => {
  const session = await auth();
  const user = session?.user as User;
  const isUserAdmin = user?.role === "admin";
  const categories = await getAllCategories();
  const inventories = await getAllInventory(user.business_Id as string);
  const tabeldata = inventories?.map((item) => ({
    id: item.id,
    sku: item.sku,
    category: item.category.name,
    item: `${item.brand} ${item.name} ${item.InventoryFields?.map(
      (field) => field.value
    ).join(" ")}`,
    quantity: `${item.quantityOnHand} ${item.measure_of_unit}`,
    reorderPoint: `${item.reorderPoint} ${item.measure_of_unit}`,
    location: item.location,
    unit_cost: `$${item.unitCost}`,
    totalValue: `$${(item.unitCost * item.quantityOnHand).toFixed(2)}`,
  }));

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10">
      {isUserAdmin && <div className="  flex flex-1 gap-x-4">
        <AddNewInventory categories={categories} businessId={user.business_Id as string} />
        <AddNewCatagory fromAddNewItemForm={false} businessId={user.business_Id as string} />
        <AddNewSupplier fromAddNewItemForm={false} businessId={user.business_Id as string} />
      </div>}
      <div className="mt-4">
        <Tabs defaultValue="inventoryList" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventoryList"  className="data-[state=active]:bg-green-500/80  ">Inventory List</TabsTrigger>
            <TabsTrigger value="receiving"  className="data-[state=active]:bg-green-500/80  ">Reciving</TabsTrigger>
               </TabsList>
          <TabsContent value="inventoryList">
            <DataTable columns={colums} data={tabeldata} />
          </TabsContent>
          <TabsContent value="receiving">
            <InventoryReceivingForm  businessId={user.business_Id as string} />
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  );
};

export default page;
