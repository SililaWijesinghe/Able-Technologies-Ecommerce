#!/bin/bash
awk '/<span className="text-gray-700 font-medium">\{item.quantity\}x <span className="font-bold text-gray-900">\{item.product_name\}<\/span> \{item.variant \? `\(\{item.variant\}\)` : '\'''\''\}<\/span>/ {
    print "                                <span className=\"text-gray-700 font-medium\">"
    print "                                  {item.quantity}x <span className=\"font-bold text-gray-900\">{item.product_name}</span>"
    print "                                  {item.variant && ("
    print "                                    <span className=\"text-blue-500 font-bold ml-1\">"
    print "                                      {(() => {"
    print "                                        try {"
    print "                                          const parsed = typeof item.variant === '\''string'\'' ? JSON.parse(item.variant) : item.variant;"
    print "                                          return parsed.sku ? `(Model: ${parsed.sku})` : `(${item.variant})`;"
    print "                                        } catch(e) {"
    print "                                          return `(${item.variant})`;"
    print "                                        }"
    print "                                      })()}"
    print "                                    </span>"
    print "                                  )}"
    print "                                </span>"
    next
}
{print}' src/pages/Profile.tsx > temp.tsx && mv temp.tsx src/pages/Profile.tsx
