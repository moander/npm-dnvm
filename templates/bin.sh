#!/bin/bash

export MONO_MANAGED_WATCHER=disabled

######## EXTERNAL SCRIPT IMPORT ########
<%= ext %>
########################################

<%=cmd%> "$@"
