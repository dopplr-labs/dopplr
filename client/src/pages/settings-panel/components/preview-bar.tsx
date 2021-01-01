import React from 'react'
import { EyeOutlined } from '@ant-design/icons'
import Editor from 'components/editor'

const sampleQuery = `WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales
    FROM orders
    GROUP BY region
 ), top_regions AS (
    SELECT region
    FROM regional_sales
    WHERE total_sales > (SELECT SUM(total_sales)/10 FROM regional_sales)
 )
SELECT region,
   product,
   SUM(quantity) AS product_units,
   SUM(amount) AS product_sales
FROM orders
WHERE region IN (SELECT region FROM top_regions)
GROUP BY region, product;`

export default function PreviewBar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 mb-2 border-b">
        <div className="space-x-2 text-base font-medium text-content-primary">
          <EyeOutlined />
          <span>Editor Preview</span>
        </div>
      </div>
      <div className="flex-1 bg-red-50">
        <Editor
          resourceId={1}
          value={sampleQuery}
          setValue={(value) => {
            console.log(value)
          }}
        />
      </div>
    </div>
  )
}
