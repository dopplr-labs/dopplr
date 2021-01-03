import React, { useContext } from 'react'
import SettingsContext from 'contexts/settings-context'
import BaseEditor from 'components/base-editor'
import { textEditorSettings as settings } from '../data/text-editor-settings'
import SettingsGroup from './settings-group'

const SAMPLE_QUERY = `WITH regional_sales AS (
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

const NO_OP = () => {}

export default function TextEditorSettings() {
  const subGroupDict = settings.subGroupDict
  const { textEditorSettings, onChangeTextEditorSettings } = useContext(
    SettingsContext,
  )

  return (
    <div className="flex space-x-8">
      <div className="flex-1 max-w-3xl space-y-8">
        {Object.keys(subGroupDict).map((subGroupKeys, idx) => (
          <SettingsGroup
            key={idx}
            subGroup={subGroupDict[subGroupKeys]}
            settings={textEditorSettings}
            onChangeSettings={onChangeTextEditorSettings}
          />
        ))}
      </div>
      <div className="sticky flex flex-col border rounded-md top-8 h-120 w-120">
        <div className="px-6 py-3 space-x-2 text-base font-medium border-b text-content-primary bg-background-primary">
          Editor Preview
        </div>
        <div className="flex-1">
          <BaseEditor value={SAMPLE_QUERY} setValue={NO_OP} />
        </div>
      </div>
    </div>
  )
}
