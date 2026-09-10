"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
type InventoryItem = {
  id: number;
  sku: string | null;
  item: string,
  category:string
  quantity: string,
  reorderPoint: string,
  location: string|null,
  unit_cost: string,
  totalValue: string,
};

export const colums: ColumnDef<InventoryItem>[] = [
  {accessorKey:"id",
    header:"ID",
    cell:({row}) =>{
      return <div>{row.getValue("id")}</div>
    }
  },

  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      return <div>{row.getValue("sku")}</div>;
    },
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => {
        return <div>{row.getValue("item")}</div>
    }
  },
  
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      
        return <div>{row.getValue("category")}</div>
    }
  },
  {
    accessorKey: "quantity",
    header: "Quantity On Hand",
    cell: ({ row }) => {
      const quantity = parseInt((row.getValue("quantity") as string).split(" ")[0]) 
      const reorderPoint = parseInt((row.getValue("reorderPoint")as string).split(" ")[0])     
      const isUnderCriticalPoint = quantity<reorderPoint

        return (
          <Badge className={cn(
                                "uppercase dark:text-white",
                                isUnderCriticalPoint ? "bg-orange-500 dark:bg-orange-900" : "bg-green-500 dark:bg-green-900"
                            )}>
            {row.getValue("quantity")}
          </Badge>
        )
    }
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
    cell: ({ row }) => {
        return <div>{row.getValue("reorderPoint")} </div>
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        return <div>{row.getValue("location")}</div>
    }
  },
  
  {
    accessorKey: "unit_cost",
    header: "Unit Cost",
    cell: ({ row }) => {
        return <div>{row.getValue("unit_cost")}</div>
    }
  },

  {
    accessorKey: "totalValue",
    header: "Total Values",
    cell: ({ row }) => {
        return <div>{row.getValue("totalValue")}</div>
        
    }
  }

];
