<script setup>

</script>

<template>
<div aria-hidden="true" class="modal fade" id="searchResultsModal" tabindex="-1">
<div class="modal-dialog modal-dialog-centered">
<div class="modal-content">
<div class="modal-header py-1 px-3">
<form action="#" class="d-flex align-items-center position-relative w-100">
<button class="btn btn-sm border-0 position-absolute start-0 p-0 text-sm" type="button">
<i class="fi fi-rr-search"></i>
</button>
<input class="form-control form-control-lg ps-4 border-0 shadow-none" id="searchInput" placeholder="Search anything's" type="text"/>
</form>
<button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
</div>
<div class="modal-body pb-2" data-simplebar="" style="height: 300px;">
<div id="recentlyResults">
<span class="text-uppercase text-2xs fw-semibold text-muted d-block mb-2">Recently Searched:</span>
<ul class="list-inline search-list">
<li>
<a class="search-item" href="index.html">
<i class="fi fi-rr-apps"></i> Dashboard
                  </a>
</li>
<li>
<a class="search-item" href="chat.html">
<i class="fi fi-rr-comment"></i> Chat
                  </a>
</li>
<li>
<a class="search-item" href="calendar.html">
<i class="fi fi-rr-calendar"></i> Calendar
                  </a>
</li>
<li>
<a class="search-item" href="chart/apexchart.html">
<i class="fi fi-rr-chart-pie-alt"></i> Apexchart
                  </a>
</li>
<li>
<a class="search-item" href="pages/pricing.html">
<i class="fi fi-rr-file"></i> Pricing
                  </a>
</li>
<li>
<a class="search-item" href="email/inbox.html">
<i class="fi fi-rr-envelope"></i> Email
                  </a>
</li>
</ul>
</div>
<div id="searchContainer"></div>
</div>
</div>
</div>
</div>
</template>
