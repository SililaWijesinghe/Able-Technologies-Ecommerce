#!/bin/bash
cat src/components/ui/NavigatedGuide.tsx | awk '
/let transform = '\''translate\(-50%, -50%\)'\''/ {
    print "  let transform = '\''translate(-50%, -50%)'\''; // default centered if no target found"
    print "  let shiftX = 0;"
    print "  let shiftY = 0;"
    next
}
/if \(position === '\''bottom'\''\) {/ {
    print "    if (position === '\''bottom'\'') {"
    print "      top = `${targetRect.bottom + padding}px`;"
    print "      const desiredLeft = targetRect.left + targetRect.width / 2;"
    print "      const popupWidth = 300;"
    print "      const margin = 16;"
    print "      if (desiredLeft + popupWidth / 2 > window.innerWidth - margin) {"
    print "        shiftX = (window.innerWidth - margin) - (desiredLeft + popupWidth / 2);"
    print "      } else if (desiredLeft - popupWidth / 2 < margin) {"
    print "        shiftX = margin - (desiredLeft - popupWidth / 2);"
    print "      }"
    print "      left = `${desiredLeft}px`;"
    print "      transform = `translateX(calc(-50% + ${shiftX}px))`;"
    skip = 4
    next
}
skip > 0 {
    skip--
    next
}
/top: -16, left: '\''50%'\''/ {
    print "                    ...(currentStep.position === '\''bottom'\'' ? { top: -16, left: `calc(50% - ${shiftX}px)`, transform: '\''translateX(-50%)'\'' } : {}),"
    next
}
/top: '\''50%'\'', left: -16/ {
    print "                    ...(currentStep.position === '\''right'\'' ? { top: `calc(50% - ${shiftY}px)`, left: -16, transform: '\''translateY(-50%)'\'' } : {}),"
    next
}
/top: '\''50%'\'', right: -16/ {
    print "                    ...(currentStep.position === '\''left'\'' ? { top: `calc(50% - ${shiftY}px)`, right: -16, transform: '\''translateY(-50%)'\'' } : {}),"
    next
}
/bottom: -16, left: '\''50%'\''/ {
    print "                    ...(currentStep.position === '\''top'\'' ? { bottom: -16, left: `calc(50% - ${shiftX}px)`, transform: '\''translateX(-50%)'\'' } : {}),"
    next
}
{print}' > temp.tsx && mv temp.tsx src/components/ui/NavigatedGuide.tsx
