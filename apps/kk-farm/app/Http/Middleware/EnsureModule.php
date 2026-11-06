<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/** Server-side permission check. Hiding a menu item is never the control. */
class EnsureModule
{
    public function handle(Request $request, Closure $next, string $module)
    {
        abort_unless($request->user()?->canModule($module), 403, 'Your role does not have access to this area.');

        return $next($request);
    }
}
