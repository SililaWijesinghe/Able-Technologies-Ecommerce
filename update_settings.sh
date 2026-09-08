#!/bin/bash
awk '/toast.success\('\''Store settings updated successfully!'\''\);/ {
    print $0
    print "      setTimeout(() => {"
    print "        window.location.reload();"
    print "      }, 1000);"
    next
}
{print}' src/pages/admin/Settings.tsx > temp.tsx && mv temp.tsx src/pages/admin/Settings.tsx
