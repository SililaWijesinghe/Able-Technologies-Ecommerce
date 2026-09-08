#!/bin/bash
awk '/const orderSummary = `Order Request Items:\\n\$\{cartItems.map\(item =>/ {
    print "        const orderSummary = `Order Request Items:\\n${cartItems.map(item => {"
    print "          let variantText = '"''"';"
    print "          if (item.variant) {"
    print "            try {"
    print "              const parsed = JSON.parse(item.variant);"
    print "              if (parsed.sku) variantText = ` - Model: ${parsed.sku}`;"
    print "            } catch (e) {"
    print "              variantText = ` - Model: ${item.variant}`;"
    print "            }"
    print "          }"
    print "          return `- ${item.quantity}x ${item.name}${variantText} ${settings.show_prices ? `(Rs. ${item.price})` : '"''"'}`;"
    print "        }).join('\''\\n'\'')}\\n\\nShipping Details:\\nAddress: ${formData.address1}, ${formData.address2 || '"''"'}\\nCity: ${formData.city}\\nDistrict: ${formData.district}`;"
    getline
    next
}
/<h4 className="text-xs font-bold text-slate-900 truncate">\{item.name\}<\/h4>/ {
    print $0
    print "                        {item.variant && ("
    print "                          <div className=\"text-[10px] text-blue-500 font-medium truncate mt-0.5\">"
    print "                            {(() => {"
    print "                              try {"
    print "                                const parsed = JSON.parse(item.variant);"
    print "                                return parsed.sku ? `Model: ${parsed.sku}` : item.variant;"
    print "                              } catch(e) {"
    print "                                return item.variant;"
    print "                              }"
    print "                            })()}"
    print "                          </div>"
    print "                        )}"
    next
}
{print}' src/pages/Checkout.tsx > temp.tsx && mv temp.tsx src/pages/Checkout.tsx
