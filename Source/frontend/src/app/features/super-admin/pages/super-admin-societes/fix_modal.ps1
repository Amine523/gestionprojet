$file = "super-admin-societes.component.ts"
$content = Get-Content $file -Raw -Encoding UTF8

# Fix 1: Close the modal-header div before the form
$old1 = '               </button>' + "`r`n" + '                    <form [formGroup]="societeForm" (ngSubmit)="saveSociete()" class="modal-body">'
$new1 = '               </button>' + "`r`n" + '            </div>' + "`r`n" + '            <form [formGroup]="societeForm" (ngSubmit)="saveSociete()" class="modal-body">'
$content = $content.Replace($old1, $new1)

# Fix 2: Remove the extra closing div (the modal-header one was already counted)
$old2 = '               </div>' + "`r`n" + '                </div>' + "`r`n" + '               <div class="toggle-field">'
$new2 = '               </div>' + "`r`n" + '               <div class="toggle-field">'
$content = $content.Replace($old2, $new2)

Set-Content $file $content -Encoding UTF8 -NoNewline
Write-Host "Done!"
