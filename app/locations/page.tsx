import { VisitorDataTable } from "@/components/table/visitors/visitors-table";

import { getAllLocations } from "./(actions)/location";
import { AddLocationDialog } from "./(components)/add-location";
import { Location, locationColumns } from "./(data)/column";

export default async function LocationsPage() {
  const allLocation = await getAllLocations();
  return (
    <div className="space-y-6 p-4">
      <VisitorDataTable<Location, unknown>
        columns={locationColumns}
        data={allLocation}
        title="Locations"
        subtitle="Manage and view all locations in the system"
        headerAction={<AddLocationDialog />}
      />
    </div>
  );
}
