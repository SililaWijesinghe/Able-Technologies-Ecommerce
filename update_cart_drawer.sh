#!/bin/bash
awk '/\{item.variant && \(/ {
    print "                          {item.variant && ("
    print "                            <div className=\"text-[10px] sm:text-[11px] text-blue-300 font-medium mt-0.5 space-y-0.5\">"
    print "                              {(() => {"
    print "                                try {"
    print "                                  const parsed = JSON.parse(item.variant);"
    print "                                  return ("
    print "                                    <>"
    print "                                      {parsed.sku && <span>Model: {parsed.sku}</span>}"
    print "                                      {parsed.type === '\''rent'\'' && <span className=\"ml-2 px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded\">Rental</span>}"
    print "                                      {parsed.notes && <p className=\"text-slate-400 italic line-clamp-2 mt-0.5\">\"{parsed.notes}\"</p>}"
    print "                                    </>"
    print "                                  );"
    print "                                } catch(e) {"
    print "                                  return <span>{item.variant}</span>;"
    print "                                }"
    print "                              })()}"
    print "                            </div>"
    print "                          )}"
    getline
    getline
    getline
    getline
    getline
    next
}
{print}' src/components/cart/CartDrawer.tsx > temp.tsx && mv temp.tsx src/components/cart/CartDrawer.tsx
