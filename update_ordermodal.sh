#!/bin/bash
awk '/<span className="font-medium text-gray-900 truncate max-w-\[200px\]">\{item.products\?.name \|\| item.product_name \|\| '\''Unknown Product'\''\}<\/span>/ {
    print "                            <div className=\"flex flex-col\">"
    print "                              <span className=\"font-medium text-gray-900 truncate max-w-[200px]\">{item.products?.name || item.product_name || '\''Unknown Product'\''}</span>"
    print "                              {item.variant && ("
    print "                                <span className=\"text-[11px] text-blue-600 font-medium mt-0.5\">"
    print "                                  {(() => {"
    print "                                    try {"
    print "                                      const parsed = typeof item.variant === '\''string'\'' ? JSON.parse(item.variant) : item.variant;"
    print "                                      return parsed.sku ? `Model: ${parsed.sku}` : item.variant;"
    print "                                    } catch(e) {"
    print "                                      return item.variant;"
    print "                                    }"
    print "                                  })()}"
    print "                                </span>"
    print "                              )}"
    print "                            </div>"
    next
}
{print}' src/components/admin/OrderDetailsModal.tsx > temp.tsx && mv temp.tsx src/components/admin/OrderDetailsModal.tsx
