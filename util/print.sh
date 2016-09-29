cat $1 | sed -e $'s/^# .*/pagenumbering\{gobble\}/g' | sed -e 's/pagenumbering/\\pagenumbering/g' | sed -e $'s/^\##/newpage\\\n##/g' | sed -e 's/newpage/\\newpage/g' | sed -e 's/## \(.*\)\\n/**\1**/g' | pandoc -V geometry:papersize="{5in,3in}" -V geometry:margin=0.15in -f markdown -o $2
open $2
