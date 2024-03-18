import React, { Suspense } from "react";

// Definisikan komponen yang ingin dimuat secara malas
const LazyComponent = React.lazy(() => import("./LaziComp"));

function Cashier() {
  return (
    <div>
      {/* Gunakan Suspense untuk wrap komponen yang dimuat secara malas */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Komponen yang dimuat secara malas */}
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default Cashier;
