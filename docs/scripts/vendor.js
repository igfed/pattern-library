function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
function _classCallCheck(t, e) {
  if (!(t instanceof e))throw new TypeError("Cannot call a class as a function")
}
!function (t, e) {
  "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function (t) {
        if (!t.document)throw new Error("jQuery requires a window with a document");
        return e(t)
      } : e(t)
}("undefined" != typeof window ? window : this, function (t, e) {
  function i(t) {
    var e = !!t && "length" in t && t.length, i = ot.type(t);
    return "function" !== i && !ot.isWindow(t) && ("array" === i || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
  }

  function n(t, e, i) {
    if (ot.isFunction(e))return ot.grep(t, function (t, n) {
      return !!e.call(t, n, t) !== i
    });
    if (e.nodeType)return ot.grep(t, function (t) {
      return t === e !== i
    });
    if ("string" == typeof e) {
      if (gt.test(e))return ot.filter(e, t, i);
      e = ot.filter(e, t)
    }
    return ot.grep(t, function (t) {
      return J.call(e, t) > -1 !== i
    })
  }

  function s(t, e) {
    for (; (t = t[e]) && 1 !== t.nodeType;);
    return t
  }

  function o(t) {
    var e = {};
    return ot.each(t.match(Ct) || [], function (t, i) {
      e[i] = !0
    }), e
  }

  function r() {
    Q.removeEventListener("DOMContentLoaded", r), t.removeEventListener("load", r), ot.ready()
  }

  function a() {
    this.expando = ot.expando + a.uid++
  }

  function l(t, e, i) {
    var n;
    if (void 0 === i && 1 === t.nodeType)if (n = "data-" + e.replace(_t, "-$&").toLowerCase(), i = t.getAttribute(n), "string" == typeof i) {
      try {
        i = "true" === i || "false" !== i && ("null" === i ? null : +i + "" === i ? +i : Ft.test(i) ? ot.parseJSON(i) : i)
      } catch (s) {
      }
      St.set(t, e, i)
    } else i = void 0;
    return i
  }

  function u(t, e, i, n) {
    var s, o = 1, r = 20, a = n ? function () {
        return n.cur()
      } : function () {
        return ot.css(t, e, "")
      }, l = a(), u = i && i[3] || (ot.cssNumber[e] ? "" : "px"), d = (ot.cssNumber[e] || "px" !== u && +l) && zt.exec(ot.css(t, e));
    if (d && d[3] !== u) {
      u = u || d[3], i = i || [], d = +l || 1;
      do o = o || ".5", d /= o, ot.style(t, e, d + u); while (o !== (o = a() / l) && 1 !== o && --r)
    }
    return i && (d = +d || +l || 0, s = i[1] ? d + (i[1] + 1) * i[2] : +i[2], n && (n.unit = u, n.start = d, n.end = s)), s
  }

  function d(t, e) {
    var i = "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e || "*") : "undefined" != typeof t.querySelectorAll ? t.querySelectorAll(e || "*") : [];
    return void 0 === e || e && ot.nodeName(t, e) ? ot.merge([t], i) : i
  }

  function c(t, e) {
    for (var i = 0, n = t.length; i < n; i++)Tt.set(t[i], "globalEval", !e || Tt.get(e[i], "globalEval"))
  }

  function h(t, e, i, n, s) {
    for (var o, r, a, l, u, h, f = e.createDocumentFragment(), p = [], g = 0, m = t.length; g < m; g++)if (o = t[g], o || 0 === o)if ("object" === ot.type(o)) ot.merge(p, o.nodeType ? [o] : o); else if (Mt.test(o)) {
      for (r = r || f.appendChild(e.createElement("div")), a = (Pt.exec(o) || ["", ""])[1].toLowerCase(), l = Rt[a] || Rt._default, r.innerHTML = l[1] + ot.htmlPrefilter(o) + l[2], h = l[0]; h--;)r = r.lastChild;
      ot.merge(p, r.childNodes), r = f.firstChild, r.textContent = ""
    } else p.push(e.createTextNode(o));
    for (f.textContent = "", g = 0; o = p[g++];)if (n && ot.inArray(o, n) > -1) s && s.push(o); else if (u = ot.contains(o.ownerDocument, o), r = d(f.appendChild(o), "script"), u && c(r), i)for (h = 0; o = r[h++];)Ht.test(o.type || "") && i.push(o);
    return f
  }

  function f() {
    return !0
  }

  function p() {
    return !1
  }

  function g() {
    try {
      return Q.activeElement
    } catch (t) {
    }
  }

  function m(t, e, i, n, s, o) {
    var r, a;
    if ("object" == typeof e) {
      "string" != typeof i && (n = n || i, i = void 0);
      for (a in e)m(t, a, i, n, e[a], o);
      return t
    }
    if (null == n && null == s ? (s = i, n = i = void 0) : null == s && ("string" == typeof i ? (s = n, n = void 0) : (s = n, n = i, i = void 0)), s === !1) s = p; else if (!s)return t;
    return 1 === o && (r = s, s = function (t) {
      return ot().off(t), r.apply(this, arguments)
    }, s.guid = r.guid || (r.guid = ot.guid++)), t.each(function () {
      ot.event.add(this, e, s, n, i)
    })
  }

  function v(t, e) {
    return ot.nodeName(t, "table") && ot.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
  }

  function y(t) {
    return t.type = (null !== t.getAttribute("type")) + "/" + t.type, t
  }

  function b(t) {
    var e = Wt.exec(t.type);
    return e ? t.type = e[1] : t.removeAttribute("type"), t
  }

  function w(t, e) {
    var i, n, s, o, r, a, l, u;
    if (1 === e.nodeType) {
      if (Tt.hasData(t) && (o = Tt.access(t), r = Tt.set(e, o), u = o.events)) {
        delete r.handle, r.events = {};
        for (s in u)for (i = 0, n = u[s].length; i < n; i++)ot.event.add(e, s, u[s][i])
      }
      St.hasData(t) && (a = St.access(t), l = ot.extend({}, a), St.set(e, l))
    }
  }

  function C(t, e) {
    var i = e.nodeName.toLowerCase();
    "input" === i && Ot.test(t.type) ? e.checked = t.checked : "input" !== i && "textarea" !== i || (e.defaultValue = t.defaultValue)
  }

  function k(t, e, i, n) {
    e = G.apply([], e);
    var s, o, r, a, l, u, c = 0, f = t.length, p = f - 1, g = e[0], m = ot.isFunction(g);
    if (m || f > 1 && "string" == typeof g && !nt.checkClone && Bt.test(g))return t.each(function (s) {
      var o = t.eq(s);
      m && (e[0] = g.call(this, s, o.html())), k(o, e, i, n)
    });
    if (f && (s = h(e, t[0].ownerDocument, !1, t, n), o = s.firstChild, 1 === s.childNodes.length && (s = o), o || n)) {
      for (r = ot.map(d(s, "script"), y), a = r.length; c < f; c++)l = s, c !== p && (l = ot.clone(l, !0, !0), a && ot.merge(r, d(l, "script"))), i.call(t[c], l, c);
      if (a)for (u = r[r.length - 1].ownerDocument, ot.map(r, b), c = 0; c < a; c++)l = r[c], Ht.test(l.type || "") && !Tt.access(l, "globalEval") && ot.contains(u, l) && (l.src ? ot._evalUrl && ot._evalUrl(l.src) : ot.globalEval(l.textContent.replace(Kt, "")))
    }
    return t
  }

  function $(t, e, i) {
    for (var n, s = e ? ot.filter(e, t) : t, o = 0; null != (n = s[o]); o++)i || 1 !== n.nodeType || ot.cleanData(d(n)), n.parentNode && (i && ot.contains(n.ownerDocument, n) && c(d(n, "script")), n.parentNode.removeChild(n));
    return t
  }

  function x(t, e) {
    var i = ot(e.createElement(t)).appendTo(e.body), n = ot.css(i[0], "display");
    return i.detach(), n
  }

  function T(t) {
    var e = Q, i = Zt[t];
    return i || (i = x(t, e), "none" !== i && i || (Ut = (Ut || ot("<iframe frameborder='0' width='0' height='0'/>")).appendTo(e.documentElement), e = Ut[0].contentDocument, e.write(), e.close(), i = x(t, e), Ut.detach()), Zt[t] = i), i
  }

  function S(t, e, i) {
    var n, s, o, r, a = t.style;
    return i = i || Vt(t), r = i ? i.getPropertyValue(e) || i[e] : void 0, "" !== r && void 0 !== r || ot.contains(t.ownerDocument, t) || (r = ot.style(t, e)), i && !nt.pixelMarginRight() && Qt.test(r) && Yt.test(e) && (n = a.width, s = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = i.width, a.width = n, a.minWidth = s, a.maxWidth = o), void 0 !== r ? r + "" : r
  }

  function F(t, e) {
    return {
      get: function () {
        return t() ? void delete this.get : (this.get = e).apply(this, arguments)
      }
    }
  }

  function _(t) {
    if (t in ne)return t;
    for (var e = t[0].toUpperCase() + t.slice(1), i = ie.length; i--;)if (t = ie[i] + e, t in ne)return t
  }

  function A(t, e, i) {
    var n = zt.exec(e);
    return n ? Math.max(0, n[2] - (i || 0)) + (n[3] || "px") : e
  }

  function z(t, e, i, n, s) {
    for (var o = i === (n ? "border" : "content") ? 4 : "width" === e ? 1 : 0, r = 0; o < 4; o += 2)"margin" === i && (r += ot.css(t, i + Et[o], !0, s)), n ? ("content" === i && (r -= ot.css(t, "padding" + Et[o], !0, s)), "margin" !== i && (r -= ot.css(t, "border" + Et[o] + "Width", !0, s))) : (r += ot.css(t, "padding" + Et[o], !0, s), "padding" !== i && (r += ot.css(t, "border" + Et[o] + "Width", !0, s)));
    return r
  }

  function E(t, e, i) {
    var n = !0, s = "width" === e ? t.offsetWidth : t.offsetHeight, o = Vt(t), r = "border-box" === ot.css(t, "boxSizing", !1, o);
    if (s <= 0 || null == s) {
      if (s = S(t, e, o), (s < 0 || null == s) && (s = t.style[e]), Qt.test(s))return s;
      n = r && (nt.boxSizingReliable() || s === t.style[e]), s = parseFloat(s) || 0
    }
    return s + z(t, e, i || (r ? "border" : "content"), n, o) + "px"
  }

  function D(t, e) {
    for (var i, n, s, o = [], r = 0, a = t.length; r < a; r++)n = t[r], n.style && (o[r] = Tt.get(n, "olddisplay"), i = n.style.display, e ? (o[r] || "none" !== i || (n.style.display = ""), "" === n.style.display && Dt(n) && (o[r] = Tt.access(n, "olddisplay", T(n.nodeName)))) : (s = Dt(n), "none" === i && s || Tt.set(n, "olddisplay", s ? i : ot.css(n, "display"))));
    for (r = 0; r < a; r++)n = t[r], n.style && (e && "none" !== n.style.display && "" !== n.style.display || (n.style.display = e ? o[r] || "" : "none"));
    return t
  }

  function O(t, e, i, n, s) {
    return new O.prototype.init(t, e, i, n, s)
  }

  function P() {
    return t.setTimeout(function () {
      se = void 0
    }), se = ot.now()
  }

  function H(t, e) {
    var i, n = 0, s = { height: t };
    for (e = e ? 1 : 0; n < 4; n += 2 - e)i = Et[n], s["margin" + i] = s["padding" + i] = t;
    return e && (s.opacity = s.width = t), s
  }

  function R(t, e, i) {
    for (var n, s = (q.tweeners[e] || []).concat(q.tweeners["*"]), o = 0, r = s.length; o < r; o++)if (n = s[o].call(i, e, t))return n
  }

  function M(t, e, i) {
    var n, s, o, r, a, l, u, d, c = this, h = {}, f = t.style, p = t.nodeType && Dt(t), g = Tt.get(t, "fxshow");
    i.queue || (a = ot._queueHooks(t, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function () {
      a.unqueued || l()
    }), a.unqueued++, c.always(function () {
      c.always(function () {
        a.unqueued--, ot.queue(t, "fx").length || a.empty.fire()
      })
    })), 1 === t.nodeType && ("height" in e || "width" in e) && (i.overflow = [f.overflow, f.overflowX, f.overflowY], u = ot.css(t, "display"), d = "none" === u ? Tt.get(t, "olddisplay") || T(t.nodeName) : u, "inline" === d && "none" === ot.css(t, "float") && (f.display = "inline-block")), i.overflow && (f.overflow = "hidden", c.always(function () {
      f.overflow = i.overflow[0], f.overflowX = i.overflow[1], f.overflowY = i.overflow[2]
    }));
    for (n in e)if (s = e[n], re.exec(s)) {
      if (delete e[n], o = o || "toggle" === s, s === (p ? "hide" : "show")) {
        if ("show" !== s || !g || void 0 === g[n])continue;
        p = !0
      }
      h[n] = g && g[n] || ot.style(t, n)
    } else u = void 0;
    if (ot.isEmptyObject(h)) "inline" === ("none" === u ? T(t.nodeName) : u) && (f.display = u); else {
      g ? "hidden" in g && (p = g.hidden) : g = Tt.access(t, "fxshow", {}), o && (g.hidden = !p), p ? ot(t).show() : c.done(function () {
          ot(t).hide()
        }), c.done(function () {
        var e;
        Tt.remove(t, "fxshow");
        for (e in h)ot.style(t, e, h[e])
      });
      for (n in h)r = R(p ? g[n] : 0, n, c), n in g || (g[n] = r.start, p && (r.end = r.start, r.start = "width" === n || "height" === n ? 1 : 0))
    }
  }

  function L(t, e) {
    var i, n, s, o, r;
    for (i in t)if (n = ot.camelCase(i), s = e[n], o = t[i], ot.isArray(o) && (s = o[1], o = t[i] = o[0]), i !== n && (t[n] = o, delete t[i]), r = ot.cssHooks[n], r && "expand" in r) {
      o = r.expand(o), delete t[n];
      for (i in o)i in t || (t[i] = o[i], e[i] = s)
    } else e[n] = s
  }

  function q(t, e, i) {
    var n, s, o = 0, r = q.prefilters.length, a = ot.Deferred().always(function () {
      delete l.elem
    }), l = function () {
      if (s)return !1;
      for (var e = se || P(), i = Math.max(0, u.startTime + u.duration - e), n = i / u.duration || 0, o = 1 - n, r = 0, l = u.tweens.length; r < l; r++)u.tweens[r].run(o);
      return a.notifyWith(t, [u, o, i]), o < 1 && l ? i : (a.resolveWith(t, [u]), !1)
    }, u = a.promise({
      elem: t,
      props: ot.extend({}, e),
      opts: ot.extend(!0, { specialEasing: {}, easing: ot.easing._default }, i),
      originalProperties: e,
      originalOptions: i,
      startTime: se || P(),
      duration: i.duration,
      tweens: [],
      createTween: function (e, i) {
        var n = ot.Tween(t, u.opts, e, i, u.opts.specialEasing[e] || u.opts.easing);
        return u.tweens.push(n), n
      },
      stop: function (e) {
        var i = 0, n = e ? u.tweens.length : 0;
        if (s)return this;
        for (s = !0; i < n; i++)u.tweens[i].run(1);
        return e ? (a.notifyWith(t, [u, 1, 0]), a.resolveWith(t, [u, e])) : a.rejectWith(t, [u, e]), this
      }
    }), d = u.props;
    for (L(d, u.opts.specialEasing); o < r; o++)if (n = q.prefilters[o].call(u, t, d, u.opts))return ot.isFunction(n.stop) && (ot._queueHooks(u.elem, u.opts.queue).stop = ot.proxy(n.stop, n)), n;
    return ot.map(d, R, u), ot.isFunction(u.opts.start) && u.opts.start.call(t, u), ot.fx.timer(ot.extend(l, {
      elem: t,
      anim: u,
      queue: u.opts.queue
    })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
  }

  function I(t) {
    return t.getAttribute && t.getAttribute("class") || ""
  }

  function N(t) {
    return function (e, i) {
      "string" != typeof e && (i = e, e = "*");
      var n, s = 0, o = e.toLowerCase().match(Ct) || [];
      if (ot.isFunction(i))for (; n = o[s++];)"+" === n[0] ? (n = n.slice(1) || "*", (t[n] = t[n] || []).unshift(i)) : (t[n] = t[n] || []).push(i)
    }
  }

  function j(t, e, i, n) {
    function s(a) {
      var l;
      return o[a] = !0, ot.each(t[a] || [], function (t, a) {
        var u = a(e, i, n);
        return "string" != typeof u || r || o[u] ? r ? !(l = u) : void 0 : (e.dataTypes.unshift(u), s(u), !1)
      }), l
    }

    var o = {}, r = t === Se;
    return s(e.dataTypes[0]) || !o["*"] && s("*")
  }

  function B(t, e) {
    var i, n, s = ot.ajaxSettings.flatOptions || {};
    for (i in e)void 0 !== e[i] && ((s[i] ? t : n || (n = {}))[i] = e[i]);
    return n && ot.extend(!0, t, n), t
  }

  function W(t, e, i) {
    for (var n, s, o, r, a = t.contents, l = t.dataTypes; "*" === l[0];)l.shift(), void 0 === n && (n = t.mimeType || e.getResponseHeader("Content-Type"));
    if (n)for (s in a)if (a[s] && a[s].test(n)) {
      l.unshift(s);
      break
    }
    if (l[0] in i) o = l[0]; else {
      for (s in i) {
        if (!l[0] || t.converters[s + " " + l[0]]) {
          o = s;
          break
        }
        r || (r = s)
      }
      o = o || r
    }
    if (o)return o !== l[0] && l.unshift(o), i[o]
  }

  function K(t, e, i, n) {
    var s, o, r, a, l, u = {}, d = t.dataTypes.slice();
    if (d[1])for (r in t.converters)u[r.toLowerCase()] = t.converters[r];
    for (o = d.shift(); o;)if (t.responseFields[o] && (i[t.responseFields[o]] = e), !l && n && t.dataFilter && (e = t.dataFilter(e, t.dataType)), l = o, o = d.shift())if ("*" === o) o = l; else if ("*" !== l && l !== o) {
      if (r = u[l + " " + o] || u["* " + o], !r)for (s in u)if (a = s.split(" "), a[1] === o && (r = u[l + " " + a[0]] || u["* " + a[0]])) {
        r === !0 ? r = u[s] : u[s] !== !0 && (o = a[0], d.unshift(a[1]));
        break
      }
      if (r !== !0)if (r && t["throws"]) e = r(e); else try {
        e = r(e)
      } catch (c) {
        return { state: "parsererror", error: r ? c : "No conversion from " + l + " to " + o }
      }
    }
    return { state: "success", data: e }
  }

  function U(t, e, i, n) {
    var s;
    if (ot.isArray(e)) ot.each(e, function (e, s) {
      i || ze.test(t) ? n(t, s) : U(t + "[" + ("object" == typeof s && null != s ? e : "") + "]", s, i, n)
    }); else if (i || "object" !== ot.type(e)) n(t, e); else for (s in e)U(t + "[" + s + "]", e[s], i, n)
  }

  function Z(t) {
    return ot.isWindow(t) ? t : 9 === t.nodeType && t.defaultView
  }

  var Y = [], Q = t.document, V = Y.slice, G = Y.concat, X = Y.push, J = Y.indexOf, tt = {}, et = tt.toString, it = tt.hasOwnProperty, nt = {}, st = "2.2.4", ot = function (t, e) {
    return new ot.fn.init(t, e)
  }, rt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, at = /^-ms-/, lt = /-([\da-z])/gi, ut = function (t, e) {
    return e.toUpperCase()
  };
  ot.fn = ot.prototype = {
    jquery: st, constructor: ot, selector: "", length: 0, toArray: function () {
      return V.call(this)
    }, get: function (t) {
      return null != t ? t < 0 ? this[t + this.length] : this[t] : V.call(this)
    }, pushStack: function (t) {
      var e = ot.merge(this.constructor(), t);
      return e.prevObject = this, e.context = this.context, e
    }, each: function (t) {
      return ot.each(this, t)
    }, map: function (t) {
      return this.pushStack(ot.map(this, function (e, i) {
        return t.call(e, i, e)
      }))
    }, slice: function () {
      return this.pushStack(V.apply(this, arguments))
    }, first: function () {
      return this.eq(0)
    }, last: function () {
      return this.eq(-1)
    }, eq: function (t) {
      var e = this.length, i = +t + (t < 0 ? e : 0);
      return this.pushStack(i >= 0 && i < e ? [this[i]] : [])
    }, end: function () {
      return this.prevObject || this.constructor()
    }, push: X, sort: Y.sort, splice: Y.splice
  }, ot.extend = ot.fn.extend = function () {
    var t, e, i, n, s, o, r = arguments[0] || {}, a = 1, l = arguments.length, u = !1;
    for ("boolean" == typeof r && (u = r, r = arguments[a] || {}, a++), "object" == typeof r || ot.isFunction(r) || (r = {}), a === l && (r = this, a--); a < l; a++)if (null != (t = arguments[a]))for (e in t)i = r[e], n = t[e], r !== n && (u && n && (ot.isPlainObject(n) || (s = ot.isArray(n))) ? (s ? (s = !1, o = i && ot.isArray(i) ? i : []) : o = i && ot.isPlainObject(i) ? i : {}, r[e] = ot.extend(u, o, n)) : void 0 !== n && (r[e] = n));
    return r
  }, ot.extend({
    expando: "jQuery" + (st + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (t) {
      throw new Error(t)
    }, noop: function () {
    }, isFunction: function (t) {
      return "function" === ot.type(t)
    }, isArray: Array.isArray, isWindow: function (t) {
      return null != t && t === t.window
    }, isNumeric: function (t) {
      var e = t && t.toString();
      return !ot.isArray(t) && e - parseFloat(e) + 1 >= 0
    }, isPlainObject: function (t) {
      var e;
      if ("object" !== ot.type(t) || t.nodeType || ot.isWindow(t))return !1;
      if (t.constructor && !it.call(t, "constructor") && !it.call(t.constructor.prototype || {}, "isPrototypeOf"))return !1;
      for (e in t);
      return void 0 === e || it.call(t, e)
    }, isEmptyObject: function (t) {
      var e;
      for (e in t)return !1;
      return !0
    }, type: function (t) {
      return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? tt[et.call(t)] || "object" : typeof t
    }, globalEval: function (t) {
      var e, i = eval;
      t = ot.trim(t), t && (1 === t.indexOf("use strict") ? (e = Q.createElement("script"), e.text = t, Q.head.appendChild(e).parentNode.removeChild(e)) : i(t))
    }, camelCase: function (t) {
      return t.replace(at, "ms-").replace(lt, ut)
    }, nodeName: function (t, e) {
      return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
    }, each: function (t, e) {
      var n, s = 0;
      if (i(t))for (n = t.length; s < n && e.call(t[s], s, t[s]) !== !1; s++); else for (s in t)if (e.call(t[s], s, t[s]) === !1)break;
      return t
    }, trim: function (t) {
      return null == t ? "" : (t + "").replace(rt, "")
    }, makeArray: function (t, e) {
      var n = e || [];
      return null != t && (i(Object(t)) ? ot.merge(n, "string" == typeof t ? [t] : t) : X.call(n, t)), n
    }, inArray: function (t, e, i) {
      return null == e ? -1 : J.call(e, t, i)
    }, merge: function (t, e) {
      for (var i = +e.length, n = 0, s = t.length; n < i; n++)t[s++] = e[n];
      return t.length = s, t
    }, grep: function (t, e, i) {
      for (var n, s = [], o = 0, r = t.length, a = !i; o < r; o++)n = !e(t[o], o), n !== a && s.push(t[o]);
      return s
    }, map: function (t, e, n) {
      var s, o, r = 0, a = [];
      if (i(t))for (s = t.length; r < s; r++)o = e(t[r], r, n), null != o && a.push(o); else for (r in t)o = e(t[r], r, n), null != o && a.push(o);
      return G.apply([], a)
    }, guid: 1, proxy: function (t, e) {
      var i, n, s;
      if ("string" == typeof e && (i = t[e], e = t, t = i), ot.isFunction(t))return n = V.call(arguments, 2), s = function () {
        return t.apply(e || this, n.concat(V.call(arguments)))
      }, s.guid = t.guid = t.guid || ot.guid++, s
    }, now: Date.now, support: nt
  }), "function" == typeof Symbol && (ot.fn[Symbol.iterator] = Y[Symbol.iterator]), ot.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (t, e) {
    tt["[object " + e + "]"] = e.toLowerCase()
  });
  var dt = function (t) {
    function e(t, e, i, n) {
      var s, o, r, a, l, u, c, f, p = e && e.ownerDocument, g = e ? e.nodeType : 9;
      if (i = i || [], "string" != typeof t || !t || 1 !== g && 9 !== g && 11 !== g)return i;
      if (!n && ((e ? e.ownerDocument || e : I) !== D && E(e), e = e || D, P)) {
        if (11 !== g && (u = vt.exec(t)))if (s = u[1]) {
          if (9 === g) {
            if (!(r = e.getElementById(s)))return i;
            if (r.id === s)return i.push(r), i
          } else if (p && (r = p.getElementById(s)) && L(e, r) && r.id === s)return i.push(r), i
        } else {
          if (u[2])return X.apply(i, e.getElementsByTagName(t)), i;
          if ((s = u[3]) && C.getElementsByClassName && e.getElementsByClassName)return X.apply(i, e.getElementsByClassName(s)), i
        }
        if (C.qsa && !K[t + " "] && (!H || !H.test(t))) {
          if (1 !== g) p = e, f = t; else if ("object" !== e.nodeName.toLowerCase()) {
            for ((a = e.getAttribute("id")) ? a = a.replace(bt, "\\$&") : e.setAttribute("id", a = q), c = T(t), o = c.length, l = ht.test(a) ? "#" + a : "[id='" + a + "']"; o--;)c[o] = l + " " + h(c[o]);
            f = c.join(","), p = yt.test(t) && d(e.parentNode) || e
          }
          if (f)try {
            return X.apply(i, p.querySelectorAll(f)), i
          } catch (m) {
          } finally {
            a === q && e.removeAttribute("id")
          }
        }
      }
      return F(t.replace(at, "$1"), e, i, n)
    }

    function i() {
      function t(i, n) {
        return e.push(i + " ") > k.cacheLength && delete t[e.shift()], t[i + " "] = n
      }

      var e = [];
      return t
    }

    function n(t) {
      return t[q] = !0, t
    }

    function s(t) {
      var e = D.createElement("div");
      try {
        return !!t(e)
      } catch (i) {
        return !1
      } finally {
        e.parentNode && e.parentNode.removeChild(e), e = null
      }
    }

    function o(t, e) {
      for (var i = t.split("|"), n = i.length; n--;)k.attrHandle[i[n]] = e
    }

    function r(t, e) {
      var i = e && t, n = i && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || Z) - (~t.sourceIndex || Z);
      if (n)return n;
      if (i)for (; i = i.nextSibling;)if (i === e)return -1;
      return t ? 1 : -1
    }

    function a(t) {
      return function (e) {
        var i = e.nodeName.toLowerCase();
        return "input" === i && e.type === t
      }
    }

    function l(t) {
      return function (e) {
        var i = e.nodeName.toLowerCase();
        return ("input" === i || "button" === i) && e.type === t
      }
    }

    function u(t) {
      return n(function (e) {
        return e = +e, n(function (i, n) {
          for (var s, o = t([], i.length, e), r = o.length; r--;)i[s = o[r]] && (i[s] = !(n[s] = i[s]))
        })
      })
    }

    function d(t) {
      return t && "undefined" != typeof t.getElementsByTagName && t
    }

    function c() {
    }

    function h(t) {
      for (var e = 0, i = t.length, n = ""; e < i; e++)n += t[e].value;
      return n
    }

    function f(t, e, i) {
      var n = e.dir, s = i && "parentNode" === n, o = j++;
      return e.first ? function (e, i, o) {
          for (; e = e[n];)if (1 === e.nodeType || s)return t(e, i, o)
        } : function (e, i, r) {
          var a, l, u, d = [N, o];
          if (r) {
            for (; e = e[n];)if ((1 === e.nodeType || s) && t(e, i, r))return !0
          } else for (; e = e[n];)if (1 === e.nodeType || s) {
            if (u = e[q] || (e[q] = {}), l = u[e.uniqueID] || (u[e.uniqueID] = {}), (a = l[n]) && a[0] === N && a[1] === o)return d[2] = a[2];
            if (l[n] = d, d[2] = t(e, i, r))return !0
          }
        }
    }

    function p(t) {
      return t.length > 1 ? function (e, i, n) {
          for (var s = t.length; s--;)if (!t[s](e, i, n))return !1;
          return !0
        } : t[0]
    }

    function g(t, i, n) {
      for (var s = 0, o = i.length; s < o; s++)e(t, i[s], n);
      return n
    }

    function m(t, e, i, n, s) {
      for (var o, r = [], a = 0, l = t.length, u = null != e; a < l; a++)(o = t[a]) && (i && !i(o, n, s) || (r.push(o), u && e.push(a)));
      return r
    }

    function v(t, e, i, s, o, r) {
      return s && !s[q] && (s = v(s)), o && !o[q] && (o = v(o, r)), n(function (n, r, a, l) {
        var u, d, c, h = [], f = [], p = r.length, v = n || g(e || "*", a.nodeType ? [a] : a, []), y = !t || !n && e ? v : m(v, h, t, a, l), b = i ? o || (n ? t : p || s) ? [] : r : y;
        if (i && i(y, b, a, l), s)for (u = m(b, f), s(u, [], a, l), d = u.length; d--;)(c = u[d]) && (b[f[d]] = !(y[f[d]] = c));
        if (n) {
          if (o || t) {
            if (o) {
              for (u = [], d = b.length; d--;)(c = b[d]) && u.push(y[d] = c);
              o(null, b = [], u, l)
            }
            for (d = b.length; d--;)(c = b[d]) && (u = o ? tt(n, c) : h[d]) > -1 && (n[u] = !(r[u] = c))
          }
        } else b = m(b === r ? b.splice(p, b.length) : b), o ? o(null, r, b, l) : X.apply(r, b)
      })
    }

    function y(t) {
      for (var e, i, n, s = t.length, o = k.relative[t[0].type], r = o || k.relative[" "], a = o ? 1 : 0, l = f(function (t) {
        return t === e
      }, r, !0), u = f(function (t) {
        return tt(e, t) > -1
      }, r, !0), d = [function (t, i, n) {
        var s = !o && (n || i !== _) || ((e = i).nodeType ? l(t, i, n) : u(t, i, n));
        return e = null, s
      }]; a < s; a++)if (i = k.relative[t[a].type]) d = [f(p(d), i)]; else {
        if (i = k.filter[t[a].type].apply(null, t[a].matches), i[q]) {
          for (n = ++a; n < s && !k.relative[t[n].type]; n++);
          return v(a > 1 && p(d), a > 1 && h(t.slice(0, a - 1).concat({ value: " " === t[a - 2].type ? "*" : "" })).replace(at, "$1"), i, a < n && y(t.slice(a, n)), n < s && y(t = t.slice(n)), n < s && h(t))
        }
        d.push(i)
      }
      return p(d)
    }

    function b(t, i) {
      var s = i.length > 0, o = t.length > 0, r = function (n, r, a, l, u) {
        var d, c, h, f = 0, p = "0", g = n && [], v = [], y = _, b = n || o && k.find.TAG("*", u), w = N += null == y ? 1 : Math.random() || .1, C = b.length;
        for (u && (_ = r === D || r || u); p !== C && null != (d = b[p]); p++) {
          if (o && d) {
            for (c = 0, r || d.ownerDocument === D || (E(d), a = !P); h = t[c++];)if (h(d, r || D, a)) {
              l.push(d);
              break
            }
            u && (N = w)
          }
          s && ((d = !h && d) && f--, n && g.push(d))
        }
        if (f += p, s && p !== f) {
          for (c = 0; h = i[c++];)h(g, v, r, a);
          if (n) {
            if (f > 0)for (; p--;)g[p] || v[p] || (v[p] = V.call(l));
            v = m(v)
          }
          X.apply(l, v), u && !n && v.length > 0 && f + i.length > 1 && e.uniqueSort(l)
        }
        return u && (N = w, _ = y), g
      };
      return s ? n(r) : r
    }

    var w, C, k, $, x, T, S, F, _, A, z, E, D, O, P, H, R, M, L, q = "sizzle" + 1 * new Date, I = t.document, N = 0, j = 0, B = i(), W = i(), K = i(), U = function (t, e) {
      return t === e && (z = !0), 0
    }, Z = 1 << 31, Y = {}.hasOwnProperty, Q = [], V = Q.pop, G = Q.push, X = Q.push, J = Q.slice, tt = function (t, e) {
      for (var i = 0, n = t.length; i < n; i++)if (t[i] === e)return i;
      return -1
    }, et = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", it = "[\\x20\\t\\r\\n\\f]", nt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", st = "\\[" + it + "*(" + nt + ")(?:" + it + "*([*^$|!~]?=)" + it + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + nt + "))|)" + it + "*\\]", ot = ":(" + nt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + st + ")*)|.*)\\)|)", rt = new RegExp(it + "+", "g"), at = new RegExp("^" + it + "+|((?:^|[^\\\\])(?:\\\\.)*)" + it + "+$", "g"), lt = new RegExp("^" + it + "*," + it + "*"), ut = new RegExp("^" + it + "*([>+~]|" + it + ")" + it + "*"), dt = new RegExp("=" + it + "*([^\\]'\"]*?)" + it + "*\\]", "g"), ct = new RegExp(ot), ht = new RegExp("^" + nt + "$"), ft = {
      ID: new RegExp("^#(" + nt + ")"),
      CLASS: new RegExp("^\\.(" + nt + ")"),
      TAG: new RegExp("^(" + nt + "|[*])"),
      ATTR: new RegExp("^" + st),
      PSEUDO: new RegExp("^" + ot),
      CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + it + "*(even|odd|(([+-]|)(\\d*)n|)" + it + "*(?:([+-]|)" + it + "*(\\d+)|))" + it + "*\\)|)", "i"),
      bool: new RegExp("^(?:" + et + ")$", "i"),
      needsContext: new RegExp("^" + it + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + it + "*((?:-\\d)?\\d*)" + it + "*\\)|)(?=[^-]|$)", "i")
    }, pt = /^(?:input|select|textarea|button)$/i, gt = /^h\d$/i, mt = /^[^{]+\{\s*\[native \w/, vt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, yt = /[+~]/, bt = /'|\\/g, wt = new RegExp("\\\\([\\da-f]{1,6}" + it + "?|(" + it + ")|.)", "ig"), Ct = function (t, e, i) {
      var n = "0x" + e - 65536;
      return n !== n || i ? e : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
    }, kt = function () {
      E()
    };
    try {
      X.apply(Q = J.call(I.childNodes), I.childNodes), Q[I.childNodes.length].nodeType
    } catch ($t) {
      X = {
        apply: Q.length ? function (t, e) {
            G.apply(t, J.call(e))
          } : function (t, e) {
            for (var i = t.length, n = 0; t[i++] = e[n++];);
            t.length = i - 1
          }
      }
    }
    C = e.support = {}, x = e.isXML = function (t) {
      var e = t && (t.ownerDocument || t).documentElement;
      return !!e && "HTML" !== e.nodeName
    }, E = e.setDocument = function (t) {
      var e, i, n = t ? t.ownerDocument || t : I;
      return n !== D && 9 === n.nodeType && n.documentElement ? (D = n, O = D.documentElement, P = !x(D), (i = D.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", kt, !1) : i.attachEvent && i.attachEvent("onunload", kt)), C.attributes = s(function (t) {
          return t.className = "i", !t.getAttribute("className")
        }), C.getElementsByTagName = s(function (t) {
          return t.appendChild(D.createComment("")), !t.getElementsByTagName("*").length
        }), C.getElementsByClassName = mt.test(D.getElementsByClassName), C.getById = s(function (t) {
          return O.appendChild(t).id = q, !D.getElementsByName || !D.getElementsByName(q).length
        }), C.getById ? (k.find.ID = function (t, e) {
            if ("undefined" != typeof e.getElementById && P) {
              var i = e.getElementById(t);
              return i ? [i] : []
            }
          }, k.filter.ID = function (t) {
            var e = t.replace(wt, Ct);
            return function (t) {
              return t.getAttribute("id") === e
            }
          }) : (delete k.find.ID, k.filter.ID = function (t) {
            var e = t.replace(wt, Ct);
            return function (t) {
              var i = "undefined" != typeof t.getAttributeNode && t.getAttributeNode("id");
              return i && i.value === e
            }
          }), k.find.TAG = C.getElementsByTagName ? function (t, e) {
            return "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t) : C.qsa ? e.querySelectorAll(t) : void 0
          } : function (t, e) {
            var i, n = [], s = 0, o = e.getElementsByTagName(t);
            if ("*" === t) {
              for (; i = o[s++];)1 === i.nodeType && n.push(i);
              return n
            }
            return o
          }, k.find.CLASS = C.getElementsByClassName && function (t, e) {
            if ("undefined" != typeof e.getElementsByClassName && P)return e.getElementsByClassName(t)
          }, R = [], H = [], (C.qsa = mt.test(D.querySelectorAll)) && (s(function (t) {
          O.appendChild(t).innerHTML = "<a id='" + q + "'></a><select id='" + q + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && H.push("[*^$]=" + it + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || H.push("\\[" + it + "*(?:value|" + et + ")"), t.querySelectorAll("[id~=" + q + "-]").length || H.push("~="), t.querySelectorAll(":checked").length || H.push(":checked"), t.querySelectorAll("a#" + q + "+*").length || H.push(".#.+[+~]")
        }), s(function (t) {
          var e = D.createElement("input");
          e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && H.push("name" + it + "*[*^$|!~]?="), t.querySelectorAll(":enabled").length || H.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), H.push(",.*:")
        })), (C.matchesSelector = mt.test(M = O.matches || O.webkitMatchesSelector || O.mozMatchesSelector || O.oMatchesSelector || O.msMatchesSelector)) && s(function (t) {
          C.disconnectedMatch = M.call(t, "div"), M.call(t, "[s!='']:x"), R.push("!=", ot)
        }), H = H.length && new RegExp(H.join("|")), R = R.length && new RegExp(R.join("|")), e = mt.test(O.compareDocumentPosition), L = e || mt.test(O.contains) ? function (t, e) {
            var i = 9 === t.nodeType ? t.documentElement : t, n = e && e.parentNode;
            return t === n || !(!n || 1 !== n.nodeType || !(i.contains ? i.contains(n) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(n)))
          } : function (t, e) {
            if (e)for (; e = e.parentNode;)if (e === t)return !0;
            return !1
          }, U = e ? function (t, e) {
            if (t === e)return z = !0, 0;
            var i = !t.compareDocumentPosition - !e.compareDocumentPosition;
            return i ? i : (i = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1, 1 & i || !C.sortDetached && e.compareDocumentPosition(t) === i ? t === D || t.ownerDocument === I && L(I, t) ? -1 : e === D || e.ownerDocument === I && L(I, e) ? 1 : A ? tt(A, t) - tt(A, e) : 0 : 4 & i ? -1 : 1)
          } : function (t, e) {
            if (t === e)return z = !0, 0;
            var i, n = 0, s = t.parentNode, o = e.parentNode, a = [t], l = [e];
            if (!s || !o)return t === D ? -1 : e === D ? 1 : s ? -1 : o ? 1 : A ? tt(A, t) - tt(A, e) : 0;
            if (s === o)return r(t, e);
            for (i = t; i = i.parentNode;)a.unshift(i);
            for (i = e; i = i.parentNode;)l.unshift(i);
            for (; a[n] === l[n];)n++;
            return n ? r(a[n], l[n]) : a[n] === I ? -1 : l[n] === I ? 1 : 0
          }, D) : D
    }, e.matches = function (t, i) {
      return e(t, null, null, i)
    }, e.matchesSelector = function (t, i) {
      if ((t.ownerDocument || t) !== D && E(t), i = i.replace(dt, "='$1']"), C.matchesSelector && P && !K[i + " "] && (!R || !R.test(i)) && (!H || !H.test(i)))try {
        var n = M.call(t, i);
        if (n || C.disconnectedMatch || t.document && 11 !== t.document.nodeType)return n
      } catch (s) {
      }
      return e(i, D, null, [t]).length > 0
    }, e.contains = function (t, e) {
      return (t.ownerDocument || t) !== D && E(t), L(t, e)
    }, e.attr = function (t, e) {
      (t.ownerDocument || t) !== D && E(t);
      var i = k.attrHandle[e.toLowerCase()], n = i && Y.call(k.attrHandle, e.toLowerCase()) ? i(t, e, !P) : void 0;
      return void 0 !== n ? n : C.attributes || !P ? t.getAttribute(e) : (n = t.getAttributeNode(e)) && n.specified ? n.value : null
    }, e.error = function (t) {
      throw new Error("Syntax error, unrecognized expression: " + t)
    }, e.uniqueSort = function (t) {
      var e, i = [], n = 0, s = 0;
      if (z = !C.detectDuplicates, A = !C.sortStable && t.slice(0), t.sort(U), z) {
        for (; e = t[s++];)e === t[s] && (n = i.push(s));
        for (; n--;)t.splice(i[n], 1)
      }
      return A = null, t
    }, $ = e.getText = function (t) {
      var e, i = "", n = 0, s = t.nodeType;
      if (s) {
        if (1 === s || 9 === s || 11 === s) {
          if ("string" == typeof t.textContent)return t.textContent;
          for (t = t.firstChild; t; t = t.nextSibling)i += $(t)
        } else if (3 === s || 4 === s)return t.nodeValue
      } else for (; e = t[n++];)i += $(e);
      return i
    }, k = e.selectors = {
      cacheLength: 50,
      createPseudo: n,
      match: ft,
      attrHandle: {},
      find: {},
      relative: {
        ">": { dir: "parentNode", first: !0 },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: !0 },
        "~": { dir: "previousSibling" }
      },
      preFilter: {
        ATTR: function (t) {
          return t[1] = t[1].replace(wt, Ct), t[3] = (t[3] || t[4] || t[5] || "").replace(wt, Ct), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
        }, CHILD: function (t) {
          return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]), t
        }, PSEUDO: function (t) {
          var e, i = !t[6] && t[2];
          return ft.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : i && ct.test(i) && (e = T(i, !0)) && (e = i.indexOf(")", i.length - e) - i.length) && (t[0] = t[0].slice(0, e), t[2] = i.slice(0, e)), t.slice(0, 3))
        }
      },
      filter: {
        TAG: function (t) {
          var e = t.replace(wt, Ct).toLowerCase();
          return "*" === t ? function () {
              return !0
            } : function (t) {
              return t.nodeName && t.nodeName.toLowerCase() === e
            }
        }, CLASS: function (t) {
          var e = B[t + " "];
          return e || (e = new RegExp("(^|" + it + ")" + t + "(" + it + "|$)")) && B(t, function (t) {
              return e.test("string" == typeof t.className && t.className || "undefined" != typeof t.getAttribute && t.getAttribute("class") || "")
            })
        }, ATTR: function (t, i, n) {
          return function (s) {
            var o = e.attr(s, t);
            return null == o ? "!=" === i : !i || (o += "", "=" === i ? o === n : "!=" === i ? o !== n : "^=" === i ? n && 0 === o.indexOf(n) : "*=" === i ? n && o.indexOf(n) > -1 : "$=" === i ? n && o.slice(-n.length) === n : "~=" === i ? (" " + o.replace(rt, " ") + " ").indexOf(n) > -1 : "|=" === i && (o === n || o.slice(0, n.length + 1) === n + "-"))
          }
        }, CHILD: function (t, e, i, n, s) {
          var o = "nth" !== t.slice(0, 3), r = "last" !== t.slice(-4), a = "of-type" === e;
          return 1 === n && 0 === s ? function (t) {
              return !!t.parentNode
            } : function (e, i, l) {
              var u, d, c, h, f, p, g = o !== r ? "nextSibling" : "previousSibling", m = e.parentNode, v = a && e.nodeName.toLowerCase(), y = !l && !a, b = !1;
              if (m) {
                if (o) {
                  for (; g;) {
                    for (h = e; h = h[g];)if (a ? h.nodeName.toLowerCase() === v : 1 === h.nodeType)return !1;
                    p = g = "only" === t && !p && "nextSibling"
                  }
                  return !0
                }
                if (p = [r ? m.firstChild : m.lastChild], r && y) {
                  for (h = m, c = h[q] || (h[q] = {}), d = c[h.uniqueID] || (c[h.uniqueID] = {}), u = d[t] || [], f = u[0] === N && u[1], b = f && u[2], h = f && m.childNodes[f]; h = ++f && h && h[g] || (b = f = 0) || p.pop();)if (1 === h.nodeType && ++b && h === e) {
                    d[t] = [N, f, b];
                    break
                  }
                } else if (y && (h = e, c = h[q] || (h[q] = {}), d = c[h.uniqueID] || (c[h.uniqueID] = {}), u = d[t] || [], f = u[0] === N && u[1], b = f), b === !1)for (; (h = ++f && h && h[g] || (b = f = 0) || p.pop()) && ((a ? h.nodeName.toLowerCase() !== v : 1 !== h.nodeType) || !++b || (y && (c = h[q] || (h[q] = {}), d = c[h.uniqueID] || (c[h.uniqueID] = {}), d[t] = [N, b]), h !== e)););
                return b -= s, b === n || b % n === 0 && b / n >= 0
              }
            }
        }, PSEUDO: function (t, i) {
          var s, o = k.pseudos[t] || k.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
          return o[q] ? o(i) : o.length > 1 ? (s = [t, t, "", i], k.setFilters.hasOwnProperty(t.toLowerCase()) ? n(function (t, e) {
                  for (var n, s = o(t, i), r = s.length; r--;)n = tt(t, s[r]), t[n] = !(e[n] = s[r])
                }) : function (t) {
                  return o(t, 0, s)
                }) : o
        }
      },
      pseudos: {
        not: n(function (t) {
          var e = [], i = [], s = S(t.replace(at, "$1"));
          return s[q] ? n(function (t, e, i, n) {
              for (var o, r = s(t, null, n, []), a = t.length; a--;)(o = r[a]) && (t[a] = !(e[a] = o))
            }) : function (t, n, o) {
              return e[0] = t, s(e, null, o, i), e[0] = null, !i.pop()
            }
        }), has: n(function (t) {
          return function (i) {
            return e(t, i).length > 0
          }
        }), contains: n(function (t) {
          return t = t.replace(wt, Ct), function (e) {
            return (e.textContent || e.innerText || $(e)).indexOf(t) > -1
          }
        }), lang: n(function (t) {
          return ht.test(t || "") || e.error("unsupported lang: " + t), t = t.replace(wt, Ct).toLowerCase(), function (e) {
            var i;
            do if (i = P ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))return i = i.toLowerCase(), i === t || 0 === i.indexOf(t + "-"); while ((e = e.parentNode) && 1 === e.nodeType);
            return !1
          }
        }), target: function (e) {
          var i = t.location && t.location.hash;
          return i && i.slice(1) === e.id
        }, root: function (t) {
          return t === O
        }, focus: function (t) {
          return t === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
        }, enabled: function (t) {
          return t.disabled === !1
        }, disabled: function (t) {
          return t.disabled === !0
        }, checked: function (t) {
          var e = t.nodeName.toLowerCase();
          return "input" === e && !!t.checked || "option" === e && !!t.selected
        }, selected: function (t) {
          return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
        }, empty: function (t) {
          for (t = t.firstChild; t; t = t.nextSibling)if (t.nodeType < 6)return !1;
          return !0
        }, parent: function (t) {
          return !k.pseudos.empty(t)
        }, header: function (t) {
          return gt.test(t.nodeName)
        }, input: function (t) {
          return pt.test(t.nodeName)
        }, button: function (t) {
          var e = t.nodeName.toLowerCase();
          return "input" === e && "button" === t.type || "button" === e
        }, text: function (t) {
          var e;
          return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
        }, first: u(function () {
          return [0]
        }), last: u(function (t, e) {
          return [e - 1]
        }), eq: u(function (t, e, i) {
          return [i < 0 ? i + e : i]
        }), even: u(function (t, e) {
          for (var i = 0; i < e; i += 2)t.push(i);
          return t
        }), odd: u(function (t, e) {
          for (var i = 1; i < e; i += 2)t.push(i);
          return t
        }), lt: u(function (t, e, i) {
          for (var n = i < 0 ? i + e : i; --n >= 0;)t.push(n);
          return t
        }), gt: u(function (t, e, i) {
          for (var n = i < 0 ? i + e : i; ++n < e;)t.push(n);
          return t
        })
      }
    }, k.pseudos.nth = k.pseudos.eq;
    for (w in{ radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })k.pseudos[w] = a(w);
    for (w in{ submit: !0, reset: !0 })k.pseudos[w] = l(w);
    return c.prototype = k.filters = k.pseudos, k.setFilters = new c, T = e.tokenize = function (t, i) {
      var n, s, o, r, a, l, u, d = W[t + " "];
      if (d)return i ? 0 : d.slice(0);
      for (a = t, l = [], u = k.preFilter; a;) {
        n && !(s = lt.exec(a)) || (s && (a = a.slice(s[0].length) || a), l.push(o = [])), n = !1, (s = ut.exec(a)) && (n = s.shift(), o.push({
          value: n,
          type: s[0].replace(at, " ")
        }), a = a.slice(n.length));
        for (r in k.filter)!(s = ft[r].exec(a)) || u[r] && !(s = u[r](s)) || (n = s.shift(), o.push({
          value: n,
          type: r,
          matches: s
        }), a = a.slice(n.length));
        if (!n)break
      }
      return i ? a.length : a ? e.error(t) : W(t, l).slice(0)
    }, S = e.compile = function (t, e) {
      var i, n = [], s = [], o = K[t + " "];
      if (!o) {
        for (e || (e = T(t)), i = e.length; i--;)o = y(e[i]), o[q] ? n.push(o) : s.push(o);
        o = K(t, b(s, n)), o.selector = t
      }
      return o
    }, F = e.select = function (t, e, i, n) {
      var s, o, r, a, l, u = "function" == typeof t && t, c = !n && T(t = u.selector || t);
      if (i = i || [], 1 === c.length) {
        if (o = c[0] = c[0].slice(0), o.length > 2 && "ID" === (r = o[0]).type && C.getById && 9 === e.nodeType && P && k.relative[o[1].type]) {
          if (e = (k.find.ID(r.matches[0].replace(wt, Ct), e) || [])[0], !e)return i;
          u && (e = e.parentNode), t = t.slice(o.shift().value.length)
        }
        for (s = ft.needsContext.test(t) ? 0 : o.length; s-- && (r = o[s], !k.relative[a = r.type]);)if ((l = k.find[a]) && (n = l(r.matches[0].replace(wt, Ct), yt.test(o[0].type) && d(e.parentNode) || e))) {
          if (o.splice(s, 1), t = n.length && h(o), !t)return X.apply(i, n), i;
          break
        }
      }
      return (u || S(t, c))(n, e, !P, i, !e || yt.test(t) && d(e.parentNode) || e), i
    }, C.sortStable = q.split("").sort(U).join("") === q, C.detectDuplicates = !!z, E(), C.sortDetached = s(function (t) {
      return 1 & t.compareDocumentPosition(D.createElement("div"))
    }), s(function (t) {
      return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
    }) || o("type|href|height|width", function (t, e, i) {
      if (!i)return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
    }), C.attributes && s(function (t) {
      return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
    }) || o("value", function (t, e, i) {
      if (!i && "input" === t.nodeName.toLowerCase())return t.defaultValue
    }), s(function (t) {
      return null == t.getAttribute("disabled")
    }) || o(et, function (t, e, i) {
      var n;
      if (!i)return t[e] === !0 ? e.toLowerCase() : (n = t.getAttributeNode(e)) && n.specified ? n.value : null
    }), e
  }(t);
  ot.find = dt, ot.expr = dt.selectors, ot.expr[":"] = ot.expr.pseudos, ot.uniqueSort = ot.unique = dt.uniqueSort, ot.text = dt.getText, ot.isXMLDoc = dt.isXML, ot.contains = dt.contains;
  var ct = function (t, e, i) {
    for (var n = [], s = void 0 !== i; (t = t[e]) && 9 !== t.nodeType;)if (1 === t.nodeType) {
      if (s && ot(t).is(i))break;
      n.push(t)
    }
    return n
  }, ht = function (t, e) {
    for (var i = []; t; t = t.nextSibling)1 === t.nodeType && t !== e && i.push(t);
    return i
  }, ft = ot.expr.match.needsContext, pt = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, gt = /^.[^:#\[\.,]*$/;
  ot.filter = function (t, e, i) {
    var n = e[0];
    return i && (t = ":not(" + t + ")"), 1 === e.length && 1 === n.nodeType ? ot.find.matchesSelector(n, t) ? [n] : [] : ot.find.matches(t, ot.grep(e, function (t) {
        return 1 === t.nodeType
      }))
  }, ot.fn.extend({
    find: function (t) {
      var e, i = this.length, n = [], s = this;
      if ("string" != typeof t)return this.pushStack(ot(t).filter(function () {
        for (e = 0; e < i; e++)if (ot.contains(s[e], this))return !0
      }));
      for (e = 0; e < i; e++)ot.find(t, s[e], n);
      return n = this.pushStack(i > 1 ? ot.unique(n) : n), n.selector = this.selector ? this.selector + " " + t : t, n
    }, filter: function (t) {
      return this.pushStack(n(this, t || [], !1))
    }, not: function (t) {
      return this.pushStack(n(this, t || [], !0))
    }, is: function (t) {
      return !!n(this, "string" == typeof t && ft.test(t) ? ot(t) : t || [], !1).length
    }
  });
  var mt, vt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, yt = ot.fn.init = function (t, e, i) {
    var n, s;
    if (!t)return this;
    if (i = i || mt, "string" == typeof t) {
      if (n = "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3 ? [null, t, null] : vt.exec(t), !n || !n[1] && e)return !e || e.jquery ? (e || i).find(t) : this.constructor(e).find(t);
      if (n[1]) {
        if (e = e instanceof ot ? e[0] : e, ot.merge(this, ot.parseHTML(n[1], e && e.nodeType ? e.ownerDocument || e : Q, !0)), pt.test(n[1]) && ot.isPlainObject(e))for (n in e)ot.isFunction(this[n]) ? this[n](e[n]) : this.attr(n, e[n]);
        return this
      }
      return s = Q.getElementById(n[2]), s && s.parentNode && (this.length = 1, this[0] = s), this.context = Q, this.selector = t, this
    }
    return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : ot.isFunction(t) ? void 0 !== i.ready ? i.ready(t) : t(ot) : (void 0 !== t.selector && (this.selector = t.selector, this.context = t.context), ot.makeArray(t, this))
  };
  yt.prototype = ot.fn, mt = ot(Q);
  var bt = /^(?:parents|prev(?:Until|All))/, wt = { children: !0, contents: !0, next: !0, prev: !0 };
  ot.fn.extend({
    has: function (t) {
      var e = ot(t, this), i = e.length;
      return this.filter(function () {
        for (var t = 0; t < i; t++)if (ot.contains(this, e[t]))return !0
      })
    }, closest: function (t, e) {
      for (var i, n = 0, s = this.length, o = [], r = ft.test(t) || "string" != typeof t ? ot(t, e || this.context) : 0; n < s; n++)for (i = this[n]; i && i !== e; i = i.parentNode)if (i.nodeType < 11 && (r ? r.index(i) > -1 : 1 === i.nodeType && ot.find.matchesSelector(i, t))) {
        o.push(i);
        break
      }
      return this.pushStack(o.length > 1 ? ot.uniqueSort(o) : o)
    }, index: function (t) {
      return t ? "string" == typeof t ? J.call(ot(t), this[0]) : J.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    }, add: function (t, e) {
      return this.pushStack(ot.uniqueSort(ot.merge(this.get(), ot(t, e))))
    }, addBack: function (t) {
      return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
    }
  }), ot.each({
    parent: function (t) {
      var e = t.parentNode;
      return e && 11 !== e.nodeType ? e : null
    }, parents: function (t) {
      return ct(t, "parentNode")
    }, parentsUntil: function (t, e, i) {
      return ct(t, "parentNode", i)
    }, next: function (t) {
      return s(t, "nextSibling")
    }, prev: function (t) {
      return s(t, "previousSibling")
    }, nextAll: function (t) {
      return ct(t, "nextSibling")
    }, prevAll: function (t) {
      return ct(t, "previousSibling")
    }, nextUntil: function (t, e, i) {
      return ct(t, "nextSibling", i)
    }, prevUntil: function (t, e, i) {
      return ct(t, "previousSibling", i)
    }, siblings: function (t) {
      return ht((t.parentNode || {}).firstChild, t)
    }, children: function (t) {
      return ht(t.firstChild)
    }, contents: function (t) {
      return t.contentDocument || ot.merge([], t.childNodes)
    }
  }, function (t, e) {
    ot.fn[t] = function (i, n) {
      var s = ot.map(this, e, i);
      return "Until" !== t.slice(-5) && (n = i), n && "string" == typeof n && (s = ot.filter(n, s)), this.length > 1 && (wt[t] || ot.uniqueSort(s), bt.test(t) && s.reverse()), this.pushStack(s)
    }
  });
  var Ct = /\S+/g;
  ot.Callbacks = function (t) {
    t = "string" == typeof t ? o(t) : ot.extend({}, t);
    var e, i, n, s, r = [], a = [], l = -1, u = function () {
      for (s = t.once, n = e = !0; a.length; l = -1)for (i = a.shift(); ++l < r.length;)r[l].apply(i[0], i[1]) === !1 && t.stopOnFalse && (l = r.length, i = !1);
      t.memory || (i = !1), e = !1, s && (r = i ? [] : "")
    }, d = {
      add: function () {
        return r && (i && !e && (l = r.length - 1, a.push(i)), function n(e) {
          ot.each(e, function (e, i) {
            ot.isFunction(i) ? t.unique && d.has(i) || r.push(i) : i && i.length && "string" !== ot.type(i) && n(i)
          })
        }(arguments), i && !e && u()), this
      }, remove: function () {
        return ot.each(arguments, function (t, e) {
          for (var i; (i = ot.inArray(e, r, i)) > -1;)r.splice(i, 1), i <= l && l--
        }), this
      }, has: function (t) {
        return t ? ot.inArray(t, r) > -1 : r.length > 0
      }, empty: function () {
        return r && (r = []), this
      }, disable: function () {
        return s = a = [], r = i = "", this
      }, disabled: function () {
        return !r
      }, lock: function () {
        return s = a = [], i || (r = i = ""), this
      }, locked: function () {
        return !!s
      }, fireWith: function (t, i) {
        return s || (i = i || [], i = [t, i.slice ? i.slice() : i], a.push(i), e || u()), this
      }, fire: function () {
        return d.fireWith(this, arguments), this
      }, fired: function () {
        return !!n
      }
    };
    return d
  }, ot.extend({
    Deferred: function (t) {
      var e = [["resolve", "done", ot.Callbacks("once memory"), "resolved"], ["reject", "fail", ot.Callbacks("once memory"), "rejected"], ["notify", "progress", ot.Callbacks("memory")]], i = "pending", n = {
        state: function () {
          return i
        }, always: function () {
          return s.done(arguments).fail(arguments), this
        }, then: function () {
          var t = arguments;
          return ot.Deferred(function (i) {
            ot.each(e, function (e, o) {
              var r = ot.isFunction(t[e]) && t[e];
              s[o[1]](function () {
                var t = r && r.apply(this, arguments);
                t && ot.isFunction(t.promise) ? t.promise().progress(i.notify).done(i.resolve).fail(i.reject) : i[o[0] + "With"](this === n ? i.promise() : this, r ? [t] : arguments)
              })
            }), t = null
          }).promise()
        }, promise: function (t) {
          return null != t ? ot.extend(t, n) : n
        }
      }, s = {};
      return n.pipe = n.then, ot.each(e, function (t, o) {
        var r = o[2], a = o[3];
        n[o[1]] = r.add, a && r.add(function () {
          i = a
        }, e[1 ^ t][2].disable, e[2][2].lock), s[o[0]] = function () {
          return s[o[0] + "With"](this === s ? n : this, arguments), this
        }, s[o[0] + "With"] = r.fireWith
      }), n.promise(s), t && t.call(s, s), s
    }, when: function (t) {
      var e, i, n, s = 0, o = V.call(arguments), r = o.length, a = 1 !== r || t && ot.isFunction(t.promise) ? r : 0, l = 1 === a ? t : ot.Deferred(), u = function (t, i, n) {
        return function (s) {
          i[t] = this, n[t] = arguments.length > 1 ? V.call(arguments) : s, n === e ? l.notifyWith(i, n) : --a || l.resolveWith(i, n)
        }
      };
      if (r > 1)for (e = new Array(r), i = new Array(r), n = new Array(r); s < r; s++)o[s] && ot.isFunction(o[s].promise) ? o[s].promise().progress(u(s, i, e)).done(u(s, n, o)).fail(l.reject) : --a;
      return a || l.resolveWith(n, o), l.promise()
    }
  });
  var kt;
  ot.fn.ready = function (t) {
    return ot.ready.promise().done(t), this
  }, ot.extend({
    isReady: !1, readyWait: 1, holdReady: function (t) {
      t ? ot.readyWait++ : ot.ready(!0)
    }, ready: function (t) {
      (t === !0 ? --ot.readyWait : ot.isReady) || (ot.isReady = !0, t !== !0 && --ot.readyWait > 0 || (kt.resolveWith(Q, [ot]), ot.fn.triggerHandler && (ot(Q).triggerHandler("ready"), ot(Q).off("ready"))))
    }
  }), ot.ready.promise = function (e) {
    return kt || (kt = ot.Deferred(), "complete" === Q.readyState || "loading" !== Q.readyState && !Q.documentElement.doScroll ? t.setTimeout(ot.ready) : (Q.addEventListener("DOMContentLoaded", r), t.addEventListener("load", r))), kt.promise(e)
  }, ot.ready.promise();
  var $t = function (t, e, i, n, s, o, r) {
    var a = 0, l = t.length, u = null == i;
    if ("object" === ot.type(i)) {
      s = !0;
      for (a in i)$t(t, e, a, i[a], !0, o, r)
    } else if (void 0 !== n && (s = !0, ot.isFunction(n) || (r = !0), u && (r ? (e.call(t, n), e = null) : (u = e, e = function (t, e, i) {
          return u.call(ot(t), i)
        })), e))for (; a < l; a++)e(t[a], i, r ? n : n.call(t[a], a, e(t[a], i)));
    return s ? t : u ? e.call(t) : l ? e(t[0], i) : o
  }, xt = function (t) {
    return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
  };
  a.uid = 1, a.prototype = {
    register: function (t, e) {
      var i = e || {};
      return t.nodeType ? t[this.expando] = i : Object.defineProperty(t, this.expando, {
          value: i,
          writable: !0,
          configurable: !0
        }), t[this.expando]
    }, cache: function (t) {
      if (!xt(t))return {};
      var e = t[this.expando];
      return e || (e = {}, xt(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, {
          value: e,
          configurable: !0
        }))), e
    }, set: function (t, e, i) {
      var n, s = this.cache(t);
      if ("string" == typeof e) s[e] = i; else for (n in e)s[n] = e[n];
      return s
    }, get: function (t, e) {
      return void 0 === e ? this.cache(t) : t[this.expando] && t[this.expando][e]
    }, access: function (t, e, i) {
      var n;
      return void 0 === e || e && "string" == typeof e && void 0 === i ? (n = this.get(t, e), void 0 !== n ? n : this.get(t, ot.camelCase(e))) : (this.set(t, e, i), void 0 !== i ? i : e)
    }, remove: function (t, e) {
      var i, n, s, o = t[this.expando];
      if (void 0 !== o) {
        if (void 0 === e) this.register(t); else {
          ot.isArray(e) ? n = e.concat(e.map(ot.camelCase)) : (s = ot.camelCase(e), e in o ? n = [e, s] : (n = s, n = n in o ? [n] : n.match(Ct) || [])), i = n.length;
          for (; i--;)delete o[n[i]]
        }
        (void 0 === e || ot.isEmptyObject(o)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando])
      }
    }, hasData: function (t) {
      var e = t[this.expando];
      return void 0 !== e && !ot.isEmptyObject(e)
    }
  };
  var Tt = new a, St = new a, Ft = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, _t = /[A-Z]/g;
  ot.extend({
    hasData: function (t) {
      return St.hasData(t) || Tt.hasData(t)
    }, data: function (t, e, i) {
      return St.access(t, e, i)
    }, removeData: function (t, e) {
      St.remove(t, e)
    }, _data: function (t, e, i) {
      return Tt.access(t, e, i)
    }, _removeData: function (t, e) {
      Tt.remove(t, e)
    }
  }), ot.fn.extend({
    data: function (t, e) {
      var i, n, s, o = this[0], r = o && o.attributes;
      if (void 0 === t) {
        if (this.length && (s = St.get(o), 1 === o.nodeType && !Tt.get(o, "hasDataAttrs"))) {
          for (i = r.length; i--;)r[i] && (n = r[i].name, 0 === n.indexOf("data-") && (n = ot.camelCase(n.slice(5)), l(o, n, s[n])));
          Tt.set(o, "hasDataAttrs", !0)
        }
        return s
      }
      return "object" == typeof t ? this.each(function () {
          St.set(this, t)
        }) : $t(this, function (e) {
          var i, n;
          if (o && void 0 === e) {
            if (i = St.get(o, t) || St.get(o, t.replace(_t, "-$&").toLowerCase()), void 0 !== i)return i;
            if (n = ot.camelCase(t), i = St.get(o, n), void 0 !== i)return i;
            if (i = l(o, n, void 0), void 0 !== i)return i
          } else n = ot.camelCase(t), this.each(function () {
            var i = St.get(this, n);
            St.set(this, n, e), t.indexOf("-") > -1 && void 0 !== i && St.set(this, t, e)
          })
        }, null, e, arguments.length > 1, null, !0)
    }, removeData: function (t) {
      return this.each(function () {
        St.remove(this, t)
      })
    }
  }), ot.extend({
    queue: function (t, e, i) {
      var n;
      if (t)return e = (e || "fx") + "queue", n = Tt.get(t, e), i && (!n || ot.isArray(i) ? n = Tt.access(t, e, ot.makeArray(i)) : n.push(i)), n || []
    }, dequeue: function (t, e) {
      e = e || "fx";
      var i = ot.queue(t, e), n = i.length, s = i.shift(), o = ot._queueHooks(t, e), r = function () {
        ot.dequeue(t, e)
      };
      "inprogress" === s && (s = i.shift(), n--), s && ("fx" === e && i.unshift("inprogress"), delete o.stop, s.call(t, r, o)), !n && o && o.empty.fire()
    }, _queueHooks: function (t, e) {
      var i = e + "queueHooks";
      return Tt.get(t, i) || Tt.access(t, i, {
          empty: ot.Callbacks("once memory").add(function () {
            Tt.remove(t, [e + "queue", i])
          })
        })
    }
  }), ot.fn.extend({
    queue: function (t, e) {
      var i = 2;
      return "string" != typeof t && (e = t, t = "fx", i--), arguments.length < i ? ot.queue(this[0], t) : void 0 === e ? this : this.each(function () {
            var i = ot.queue(this, t, e);
            ot._queueHooks(this, t), "fx" === t && "inprogress" !== i[0] && ot.dequeue(this, t)
          })
    }, dequeue: function (t) {
      return this.each(function () {
        ot.dequeue(this, t)
      })
    }, clearQueue: function (t) {
      return this.queue(t || "fx", [])
    }, promise: function (t, e) {
      var i, n = 1, s = ot.Deferred(), o = this, r = this.length, a = function () {
        --n || s.resolveWith(o, [o])
      };
      for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; r--;)i = Tt.get(o[r], t + "queueHooks"), i && i.empty && (n++, i.empty.add(a));
      return a(), s.promise(e)
    }
  });
  var At = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, zt = new RegExp("^(?:([+-])=|)(" + At + ")([a-z%]*)$", "i"), Et = ["Top", "Right", "Bottom", "Left"], Dt = function (t, e) {
    return t = e || t, "none" === ot.css(t, "display") || !ot.contains(t.ownerDocument, t)
  }, Ot = /^(?:checkbox|radio)$/i, Pt = /<([\w:-]+)/, Ht = /^$|\/(?:java|ecma)script/i, Rt = {
    option: [1, "<select multiple='multiple'>", "</select>"],
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
  };
  Rt.optgroup = Rt.option, Rt.tbody = Rt.tfoot = Rt.colgroup = Rt.caption = Rt.thead, Rt.th = Rt.td;
  var Mt = /<|&#?\w+;/;
  !function () {
    var t = Q.createDocumentFragment(), e = t.appendChild(Q.createElement("div")), i = Q.createElement("input");
    i.setAttribute("type", "radio"), i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), e.appendChild(i), nt.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", nt.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
  }();
  var Lt = /^key/, qt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, It = /^([^.]*)(?:\.(.+)|)/;
  ot.event = {
    global: {},
    add: function (t, e, i, n, s) {
      var o, r, a, l, u, d, c, h, f, p, g, m = Tt.get(t);
      if (m)for (i.handler && (o = i, i = o.handler, s = o.selector), i.guid || (i.guid = ot.guid++), (l = m.events) || (l = m.events = {}), (r = m.handle) || (r = m.handle = function (e) {
        return "undefined" != typeof ot && ot.event.triggered !== e.type ? ot.event.dispatch.apply(t, arguments) : void 0
      }), e = (e || "").match(Ct) || [""], u = e.length; u--;)a = It.exec(e[u]) || [], f = g = a[1], p = (a[2] || "").split(".").sort(), f && (c = ot.event.special[f] || {}, f = (s ? c.delegateType : c.bindType) || f, c = ot.event.special[f] || {}, d = ot.extend({
        type: f,
        origType: g,
        data: n,
        handler: i,
        guid: i.guid,
        selector: s,
        needsContext: s && ot.expr.match.needsContext.test(s),
        namespace: p.join(".")
      }, o), (h = l[f]) || (h = l[f] = [], h.delegateCount = 0, c.setup && c.setup.call(t, n, p, r) !== !1 || t.addEventListener && t.addEventListener(f, r)), c.add && (c.add.call(t, d), d.handler.guid || (d.handler.guid = i.guid)), s ? h.splice(h.delegateCount++, 0, d) : h.push(d), ot.event.global[f] = !0)
    },
    remove: function (t, e, i, n, s) {
      var o, r, a, l, u, d, c, h, f, p, g, m = Tt.hasData(t) && Tt.get(t);
      if (m && (l = m.events)) {
        for (e = (e || "").match(Ct) || [""], u = e.length; u--;)if (a = It.exec(e[u]) || [], f = g = a[1], p = (a[2] || "").split(".").sort(), f) {
          for (c = ot.event.special[f] || {}, f = (n ? c.delegateType : c.bindType) || f, h = l[f] || [], a = a[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), r = o = h.length; o--;)d = h[o], !s && g !== d.origType || i && i.guid !== d.guid || a && !a.test(d.namespace) || n && n !== d.selector && ("**" !== n || !d.selector) || (h.splice(o, 1), d.selector && h.delegateCount--, c.remove && c.remove.call(t, d));
          r && !h.length && (c.teardown && c.teardown.call(t, p, m.handle) !== !1 || ot.removeEvent(t, f, m.handle), delete l[f])
        } else for (f in l)ot.event.remove(t, f + e[u], i, n, !0);
        ot.isEmptyObject(l) && Tt.remove(t, "handle events")
      }
    },
    dispatch: function (t) {
      t = ot.event.fix(t);
      var e, i, n, s, o, r = [], a = V.call(arguments), l = (Tt.get(this, "events") || {})[t.type] || [], u = ot.event.special[t.type] || {};
      if (a[0] = t, t.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, t) !== !1) {
        for (r = ot.event.handlers.call(this, t, l), e = 0; (s = r[e++]) && !t.isPropagationStopped();)for (t.currentTarget = s.elem, i = 0; (o = s.handlers[i++]) && !t.isImmediatePropagationStopped();)t.rnamespace && !t.rnamespace.test(o.namespace) || (t.handleObj = o, t.data = o.data, n = ((ot.event.special[o.origType] || {}).handle || o.handler).apply(s.elem, a), void 0 !== n && (t.result = n) === !1 && (t.preventDefault(), t.stopPropagation()));
        return u.postDispatch && u.postDispatch.call(this, t), t.result
      }
    },
    handlers: function (t, e) {
      var i, n, s, o, r = [], a = e.delegateCount, l = t.target;
      if (a && l.nodeType && ("click" !== t.type || isNaN(t.button) || t.button < 1))for (; l !== this; l = l.parentNode || this)if (1 === l.nodeType && (l.disabled !== !0 || "click" !== t.type)) {
        for (n = [], i = 0; i < a; i++)o = e[i], s = o.selector + " ", void 0 === n[s] && (n[s] = o.needsContext ? ot(s, this).index(l) > -1 : ot.find(s, this, null, [l]).length), n[s] && n.push(o);
        n.length && r.push({ elem: l, handlers: n })
      }
      return a < e.length && r.push({ elem: this, handlers: e.slice(a) }), r
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "), filter: function (t, e) {
        return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function (t, e) {
        var i, n, s, o = e.button;
        return null == t.pageX && null != e.clientX && (i = t.target.ownerDocument || Q, n = i.documentElement, s = i.body, t.pageX = e.clientX + (n && n.scrollLeft || s && s.scrollLeft || 0) - (n && n.clientLeft || s && s.clientLeft || 0), t.pageY = e.clientY + (n && n.scrollTop || s && s.scrollTop || 0) - (n && n.clientTop || s && s.clientTop || 0)), t.which || void 0 === o || (t.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), t
      }
    },
    fix: function (t) {
      if (t[ot.expando])return t;
      var e, i, n, s = t.type, o = t, r = this.fixHooks[s];
      for (r || (this.fixHooks[s] = r = qt.test(s) ? this.mouseHooks : Lt.test(s) ? this.keyHooks : {}), n = r.props ? this.props.concat(r.props) : this.props, t = new ot.Event(o), e = n.length; e--;)i = n[e], t[i] = o[i];
      return t.target || (t.target = Q), 3 === t.target.nodeType && (t.target = t.target.parentNode), r.filter ? r.filter(t, o) : t
    },
    special: {
      load: { noBubble: !0 }, focus: {
        trigger: function () {
          if (this !== g() && this.focus)return this.focus(), !1
        }, delegateType: "focusin"
      }, blur: {
        trigger: function () {
          if (this === g() && this.blur)return this.blur(), !1
        }, delegateType: "focusout"
      }, click: {
        trigger: function () {
          if ("checkbox" === this.type && this.click && ot.nodeName(this, "input"))return this.click(), !1
        }, _default: function (t) {
          return ot.nodeName(t.target, "a")
        }
      }, beforeunload: {
        postDispatch: function (t) {
          void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
        }
      }
    }
  }, ot.removeEvent = function (t, e, i) {
    t.removeEventListener && t.removeEventListener(e, i)
  }, ot.Event = function (t, e) {
    return this instanceof ot.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && t.returnValue === !1 ? f : p) : this.type = t, e && ot.extend(this, e), this.timeStamp = t && t.timeStamp || ot.now(), void(this[ot.expando] = !0)) : new ot.Event(t, e)
  }, ot.Event.prototype = {
    constructor: ot.Event,
    isDefaultPrevented: p,
    isPropagationStopped: p,
    isImmediatePropagationStopped: p,
    isSimulated: !1,
    preventDefault: function () {
      var t = this.originalEvent;
      this.isDefaultPrevented = f, t && !this.isSimulated && t.preventDefault()
    },
    stopPropagation: function () {
      var t = this.originalEvent;
      this.isPropagationStopped = f, t && !this.isSimulated && t.stopPropagation()
    },
    stopImmediatePropagation: function () {
      var t = this.originalEvent;
      this.isImmediatePropagationStopped = f, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation()
    }
  }, ot.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (t, e) {
    ot.event.special[t] = {
      delegateType: e, bindType: e, handle: function (t) {
        var i, n = this, s = t.relatedTarget, o = t.handleObj;
        return s && (s === n || ot.contains(n, s)) || (t.type = o.origType, i = o.handler.apply(this, arguments), t.type = e), i
      }
    }
  }), ot.fn.extend({
    on: function (t, e, i, n) {
      return m(this, t, e, i, n)
    }, one: function (t, e, i, n) {
      return m(this, t, e, i, n, 1)
    }, off: function (t, e, i) {
      var n, s;
      if (t && t.preventDefault && t.handleObj)return n = t.handleObj, ot(t.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler), this;
      if ("object" == typeof t) {
        for (s in t)this.off(s, e, t[s]);
        return this
      }
      return e !== !1 && "function" != typeof e || (i = e, e = void 0), i === !1 && (i = p), this.each(function () {
        ot.event.remove(this, t, i, e)
      })
    }
  });
  var Nt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, jt = /<script|<style|<link/i, Bt = /checked\s*(?:[^=]|=\s*.checked.)/i, Wt = /^true\/(.*)/, Kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  ot.extend({
    htmlPrefilter: function (t) {
      return t.replace(Nt, "<$1></$2>")
    }, clone: function (t, e, i) {
      var n, s, o, r, a = t.cloneNode(!0), l = ot.contains(t.ownerDocument, t);
      if (!(nt.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || ot.isXMLDoc(t)))for (r = d(a), o = d(t), n = 0, s = o.length; n < s; n++)C(o[n], r[n]);
      if (e)if (i)for (o = o || d(t), r = r || d(a), n = 0, s = o.length; n < s; n++)w(o[n], r[n]); else w(t, a);
      return r = d(a, "script"), r.length > 0 && c(r, !l && d(t, "script")), a
    }, cleanData: function (t) {
      for (var e, i, n, s = ot.event.special, o = 0; void 0 !== (i = t[o]); o++)if (xt(i)) {
        if (e = i[Tt.expando]) {
          if (e.events)for (n in e.events)s[n] ? ot.event.remove(i, n) : ot.removeEvent(i, n, e.handle);
          i[Tt.expando] = void 0
        }
        i[St.expando] && (i[St.expando] = void 0)
      }
    }
  }), ot.fn.extend({
    domManip: k, detach: function (t) {
      return $(this, t, !0)
    }, remove: function (t) {
      return $(this, t)
    }, text: function (t) {
      return $t(this, function (t) {
        return void 0 === t ? ot.text(this) : this.empty().each(function () {
            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = t)
          })
      }, null, t, arguments.length)
    }, append: function () {
      return k(this, arguments, function (t) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var e = v(this, t);
          e.appendChild(t)
        }
      })
    }, prepend: function () {
      return k(this, arguments, function (t) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var e = v(this, t);
          e.insertBefore(t, e.firstChild)
        }
      })
    }, before: function () {
      return k(this, arguments, function (t) {
        this.parentNode && this.parentNode.insertBefore(t, this)
      })
    }, after: function () {
      return k(this, arguments, function (t) {
        this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
      })
    }, empty: function () {
      for (var t, e = 0; null != (t = this[e]); e++)1 === t.nodeType && (ot.cleanData(d(t, !1)), t.textContent = "");
      return this
    }, clone: function (t, e) {
      return t = null != t && t, e = null == e ? t : e, this.map(function () {
        return ot.clone(this, t, e)
      })
    }, html: function (t) {
      return $t(this, function (t) {
        var e = this[0] || {}, i = 0, n = this.length;
        if (void 0 === t && 1 === e.nodeType)return e.innerHTML;
        if ("string" == typeof t && !jt.test(t) && !Rt[(Pt.exec(t) || ["", ""])[1].toLowerCase()]) {
          t = ot.htmlPrefilter(t);
          try {
            for (; i < n; i++)e = this[i] || {}, 1 === e.nodeType && (ot.cleanData(d(e, !1)), e.innerHTML = t);
            e = 0
          } catch (s) {
          }
        }
        e && this.empty().append(t)
      }, null, t, arguments.length)
    }, replaceWith: function () {
      var t = [];
      return k(this, arguments, function (e) {
        var i = this.parentNode;
        ot.inArray(this, t) < 0 && (ot.cleanData(d(this)), i && i.replaceChild(e, this))
      }, t)
    }
  }), ot.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (t, e) {
    ot.fn[t] = function (t) {
      for (var i, n = [], s = ot(t), o = s.length - 1, r = 0; r <= o; r++)i = r === o ? this : this.clone(!0), ot(s[r])[e](i), X.apply(n, i.get());
      return this.pushStack(n)
    }
  });
  var Ut, Zt = {
    HTML: "block",
    BODY: "block"
  }, Yt = /^margin/, Qt = new RegExp("^(" + At + ")(?!px)[a-z%]+$", "i"), Vt = function (e) {
    var i = e.ownerDocument.defaultView;
    return i && i.opener || (i = t), i.getComputedStyle(e)
  }, Gt = function (t, e, i, n) {
    var s, o, r = {};
    for (o in e)r[o] = t.style[o], t.style[o] = e[o];
    s = i.apply(t, n || []);
    for (o in e)t.style[o] = r[o];
    return s
  }, Xt = Q.documentElement;
  !function () {
    function e() {
      a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", a.innerHTML = "", Xt.appendChild(r);
      var e = t.getComputedStyle(a);
      i = "1%" !== e.top, o = "2px" === e.marginLeft, n = "4px" === e.width, a.style.marginRight = "50%", s = "4px" === e.marginRight, Xt.removeChild(r)
    }

    var i, n, s, o, r = Q.createElement("div"), a = Q.createElement("div");
    a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", nt.clearCloneStyle = "content-box" === a.style.backgroundClip, r.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", r.appendChild(a), ot.extend(nt, {
      pixelPosition: function () {
        return e(), i
      }, boxSizingReliable: function () {
        return null == n && e(), n
      }, pixelMarginRight: function () {
        return null == n && e(), s
      }, reliableMarginLeft: function () {
        return null == n && e(), o
      }, reliableMarginRight: function () {
        var e, i = a.appendChild(Q.createElement("div"));
        return i.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", a.style.width = "1px", Xt.appendChild(r), e = !parseFloat(t.getComputedStyle(i).marginRight), Xt.removeChild(r), a.removeChild(i), e
      }
    }))
  }();
  var Jt = /^(none|table(?!-c[ea]).+)/, te = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  }, ee = {
    letterSpacing: "0",
    fontWeight: "400"
  }, ie = ["Webkit", "O", "Moz", "ms"], ne = Q.createElement("div").style;
  ot.extend({
    cssHooks: {
      opacity: {
        get: function (t, e) {
          if (e) {
            var i = S(t, "opacity");
            return "" === i ? "1" : i
          }
        }
      }
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: { "float": "cssFloat" },
    style: function (t, e, i, n) {
      if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
        var s, o, r, a = ot.camelCase(e), l = t.style;
        return e = ot.cssProps[a] || (ot.cssProps[a] = _(a) || a), r = ot.cssHooks[e] || ot.cssHooks[a], void 0 === i ? r && "get" in r && void 0 !== (s = r.get(t, !1, n)) ? s : l[e] : (o = typeof i, "string" === o && (s = zt.exec(i)) && s[1] && (i = u(t, e, s), o = "number"), null != i && i === i && ("number" === o && (i += s && s[3] || (ot.cssNumber[a] ? "" : "px")), nt.clearCloneStyle || "" !== i || 0 !== e.indexOf("background") || (l[e] = "inherit"), r && "set" in r && void 0 === (i = r.set(t, i, n)) || (l[e] = i)), void 0)
      }
    },
    css: function (t, e, i, n) {
      var s, o, r, a = ot.camelCase(e);
      return e = ot.cssProps[a] || (ot.cssProps[a] = _(a) || a), r = ot.cssHooks[e] || ot.cssHooks[a], r && "get" in r && (s = r.get(t, !0, i)), void 0 === s && (s = S(t, e, n)), "normal" === s && e in ee && (s = ee[e]), "" === i || i ? (o = parseFloat(s), i === !0 || isFinite(o) ? o || 0 : s) : s
    }
  }), ot.each(["height", "width"], function (t, e) {
    ot.cssHooks[e] = {
      get: function (t, i, n) {
        if (i)return Jt.test(ot.css(t, "display")) && 0 === t.offsetWidth ? Gt(t, te, function () {
            return E(t, e, n)
          }) : E(t, e, n)
      }, set: function (t, i, n) {
        var s, o = n && Vt(t), r = n && z(t, e, n, "border-box" === ot.css(t, "boxSizing", !1, o), o);
        return r && (s = zt.exec(i)) && "px" !== (s[3] || "px") && (t.style[e] = i, i = ot.css(t, e)), A(t, i, r)
      }
    }
  }), ot.cssHooks.marginLeft = F(nt.reliableMarginLeft, function (t, e) {
    if (e)return (parseFloat(S(t, "marginLeft")) || t.getBoundingClientRect().left - Gt(t, { marginLeft: 0 }, function () {
        return t.getBoundingClientRect().left
      })) + "px"
  }), ot.cssHooks.marginRight = F(nt.reliableMarginRight, function (t, e) {
    if (e)return Gt(t, { display: "inline-block" }, S, [t, "marginRight"])
  }), ot.each({ margin: "", padding: "", border: "Width" }, function (t, e) {
    ot.cssHooks[t + e] = {
      expand: function (i) {
        for (var n = 0, s = {}, o = "string" == typeof i ? i.split(" ") : [i]; n < 4; n++)s[t + Et[n] + e] = o[n] || o[n - 2] || o[0];
        return s
      }
    }, Yt.test(t) || (ot.cssHooks[t + e].set = A)
  }), ot.fn.extend({
    css: function (t, e) {
      return $t(this, function (t, e, i) {
        var n, s, o = {}, r = 0;
        if (ot.isArray(e)) {
          for (n = Vt(t), s = e.length; r < s; r++)o[e[r]] = ot.css(t, e[r], !1, n);
          return o
        }
        return void 0 !== i ? ot.style(t, e, i) : ot.css(t, e)
      }, t, e, arguments.length > 1)
    }, show: function () {
      return D(this, !0)
    }, hide: function () {
      return D(this)
    }, toggle: function (t) {
      return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function () {
          Dt(this) ? ot(this).show() : ot(this).hide()
        })
    }
  }), ot.Tween = O, O.prototype = {
    constructor: O, init: function (t, e, i, n, s, o) {
      this.elem = t, this.prop = i, this.easing = s || ot.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = n, this.unit = o || (ot.cssNumber[i] ? "" : "px")
    }, cur: function () {
      var t = O.propHooks[this.prop];
      return t && t.get ? t.get(this) : O.propHooks._default.get(this)
    }, run: function (t) {
      var e, i = O.propHooks[this.prop];
      return this.options.duration ? this.pos = e = ot.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : O.propHooks._default.set(this), this
    }
  }, O.prototype.init.prototype = O.prototype, O.propHooks = {
    _default: {
      get: function (t) {
        var e;
        return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = ot.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0)
      }, set: function (t) {
        ot.fx.step[t.prop] ? ot.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[ot.cssProps[t.prop]] && !ot.cssHooks[t.prop] ? t.elem[t.prop] = t.now : ot.style(t.elem, t.prop, t.now + t.unit)
      }
    }
  }, O.propHooks.scrollTop = O.propHooks.scrollLeft = {
    set: function (t) {
      t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
    }
  }, ot.easing = {
    linear: function (t) {
      return t
    }, swing: function (t) {
      return .5 - Math.cos(t * Math.PI) / 2
    }, _default: "swing"
  }, ot.fx = O.prototype.init, ot.fx.step = {};
  var se, oe, re = /^(?:toggle|show|hide)$/, ae = /queueHooks$/;
  ot.Animation = ot.extend(q, {
    tweeners: {
      "*": [function (t, e) {
        var i = this.createTween(t, e);
        return u(i.elem, t, zt.exec(e), i), i
      }]
    }, tweener: function (t, e) {
      ot.isFunction(t) ? (e = t, t = ["*"]) : t = t.match(Ct);
      for (var i, n = 0, s = t.length; n < s; n++)i = t[n], q.tweeners[i] = q.tweeners[i] || [], q.tweeners[i].unshift(e)
    }, prefilters: [M], prefilter: function (t, e) {
      e ? q.prefilters.unshift(t) : q.prefilters.push(t)
    }
  }), ot.speed = function (t, e, i) {
    var n = t && "object" == typeof t ? ot.extend({}, t) : {
        complete: i || !i && e || ot.isFunction(t) && t,
        duration: t, easing: i && e || e && !ot.isFunction(e) && e
      };
    return n.duration = ot.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in ot.fx.speeds ? ot.fx.speeds[n.duration] : ot.fx.speeds._default, null != n.queue && n.queue !== !0 || (n.queue = "fx"), n.old = n.complete, n.complete = function () {
      ot.isFunction(n.old) && n.old.call(this), n.queue && ot.dequeue(this, n.queue)
    }, n
  }, ot.fn.extend({
    fadeTo: function (t, e, i, n) {
      return this.filter(Dt).css("opacity", 0).show().end().animate({ opacity: e }, t, i, n)
    }, animate: function (t, e, i, n) {
      var s = ot.isEmptyObject(t), o = ot.speed(e, i, n), r = function () {
        var e = q(this, ot.extend({}, t), o);
        (s || Tt.get(this, "finish")) && e.stop(!0)
      };
      return r.finish = r, s || o.queue === !1 ? this.each(r) : this.queue(o.queue, r)
    }, stop: function (t, e, i) {
      var n = function (t) {
        var e = t.stop;
        delete t.stop, e(i)
      };
      return "string" != typeof t && (i = e, e = t, t = void 0), e && t !== !1 && this.queue(t || "fx", []), this.each(function () {
        var e = !0, s = null != t && t + "queueHooks", o = ot.timers, r = Tt.get(this);
        if (s) r[s] && r[s].stop && n(r[s]); else for (s in r)r[s] && r[s].stop && ae.test(s) && n(r[s]);
        for (s = o.length; s--;)o[s].elem !== this || null != t && o[s].queue !== t || (o[s].anim.stop(i), e = !1, o.splice(s, 1));
        !e && i || ot.dequeue(this, t)
      })
    }, finish: function (t) {
      return t !== !1 && (t = t || "fx"), this.each(function () {
        var e, i = Tt.get(this), n = i[t + "queue"], s = i[t + "queueHooks"], o = ot.timers, r = n ? n.length : 0;
        for (i.finish = !0, ot.queue(this, t, []), s && s.stop && s.stop.call(this, !0), e = o.length; e--;)o[e].elem === this && o[e].queue === t && (o[e].anim.stop(!0), o.splice(e, 1));
        for (e = 0; e < r; e++)n[e] && n[e].finish && n[e].finish.call(this);
        delete i.finish
      })
    }
  }), ot.each(["toggle", "show", "hide"], function (t, e) {
    var i = ot.fn[e];
    ot.fn[e] = function (t, n, s) {
      return null == t || "boolean" == typeof t ? i.apply(this, arguments) : this.animate(H(e, !0), t, n, s)
    }
  }), ot.each({
    slideDown: H("show"),
    slideUp: H("hide"),
    slideToggle: H("toggle"),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
  }, function (t, e) {
    ot.fn[t] = function (t, i, n) {
      return this.animate(e, t, i, n)
    }
  }), ot.timers = [], ot.fx.tick = function () {
    var t, e = 0, i = ot.timers;
    for (se = ot.now(); e < i.length; e++)t = i[e], t() || i[e] !== t || i.splice(e--, 1);
    i.length || ot.fx.stop(), se = void 0
  }, ot.fx.timer = function (t) {
    ot.timers.push(t), t() ? ot.fx.start() : ot.timers.pop()
  }, ot.fx.interval = 13, ot.fx.start = function () {
    oe || (oe = t.setInterval(ot.fx.tick, ot.fx.interval))
  }, ot.fx.stop = function () {
    t.clearInterval(oe), oe = null
  }, ot.fx.speeds = { slow: 600, fast: 200, _default: 400 }, ot.fn.delay = function (e, i) {
    return e = ot.fx ? ot.fx.speeds[e] || e : e, i = i || "fx", this.queue(i, function (i, n) {
      var s = t.setTimeout(i, e);
      n.stop = function () {
        t.clearTimeout(s)
      }
    })
  }, function () {
    var t = Q.createElement("input"), e = Q.createElement("select"), i = e.appendChild(Q.createElement("option"));
    t.type = "checkbox", nt.checkOn = "" !== t.value, nt.optSelected = i.selected, e.disabled = !0, nt.optDisabled = !i.disabled, t = Q.createElement("input"), t.value = "t", t.type = "radio", nt.radioValue = "t" === t.value
  }();
  var le, ue = ot.expr.attrHandle;
  ot.fn.extend({
    attr: function (t, e) {
      return $t(this, ot.attr, t, e, arguments.length > 1)
    }, removeAttr: function (t) {
      return this.each(function () {
        ot.removeAttr(this, t)
      })
    }
  }), ot.extend({
    attr: function (t, e, i) {
      var n, s, o = t.nodeType;
      if (3 !== o && 8 !== o && 2 !== o)return "undefined" == typeof t.getAttribute ? ot.prop(t, e, i) : (1 === o && ot.isXMLDoc(t) || (e = e.toLowerCase(), s = ot.attrHooks[e] || (ot.expr.match.bool.test(e) ? le : void 0)), void 0 !== i ? null === i ? void ot.removeAttr(t, e) : s && "set" in s && void 0 !== (n = s.set(t, i, e)) ? n : (t.setAttribute(e, i + ""), i) : s && "get" in s && null !== (n = s.get(t, e)) ? n : (n = ot.find.attr(t, e), null == n ? void 0 : n))
    }, attrHooks: {
      type: {
        set: function (t, e) {
          if (!nt.radioValue && "radio" === e && ot.nodeName(t, "input")) {
            var i = t.value;
            return t.setAttribute("type", e), i && (t.value = i), e
          }
        }
      }
    }, removeAttr: function (t, e) {
      var i, n, s = 0, o = e && e.match(Ct);
      if (o && 1 === t.nodeType)for (; i = o[s++];)n = ot.propFix[i] || i, ot.expr.match.bool.test(i) && (t[n] = !1), t.removeAttribute(i)
    }
  }), le = {
    set: function (t, e, i) {
      return e === !1 ? ot.removeAttr(t, i) : t.setAttribute(i, i), i
    }
  }, ot.each(ot.expr.match.bool.source.match(/\w+/g), function (t, e) {
    var i = ue[e] || ot.find.attr;
    ue[e] = function (t, e, n) {
      var s, o;
      return n || (o = ue[e], ue[e] = s, s = null != i(t, e, n) ? e.toLowerCase() : null, ue[e] = o), s
    }
  });
  var de = /^(?:input|select|textarea|button)$/i, ce = /^(?:a|area)$/i;
  ot.fn.extend({
    prop: function (t, e) {
      return $t(this, ot.prop, t, e, arguments.length > 1)
    }, removeProp: function (t) {
      return this.each(function () {
        delete this[ot.propFix[t] || t]
      })
    }
  }), ot.extend({
    prop: function (t, e, i) {
      var n, s, o = t.nodeType;
      if (3 !== o && 8 !== o && 2 !== o)return 1 === o && ot.isXMLDoc(t) || (e = ot.propFix[e] || e, s = ot.propHooks[e]), void 0 !== i ? s && "set" in s && void 0 !== (n = s.set(t, i, e)) ? n : t[e] = i : s && "get" in s && null !== (n = s.get(t, e)) ? n : t[e]
    }, propHooks: {
      tabIndex: {
        get: function (t) {
          var e = ot.find.attr(t, "tabindex");
          return e ? parseInt(e, 10) : de.test(t.nodeName) || ce.test(t.nodeName) && t.href ? 0 : -1
        }
      }
    }, propFix: { "for": "htmlFor", "class": "className" }
  }), nt.optSelected || (ot.propHooks.selected = {
    get: function (t) {
      var e = t.parentNode;
      return e && e.parentNode && e.parentNode.selectedIndex, null
    }, set: function (t) {
      var e = t.parentNode;
      e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
    }
  }), ot.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    ot.propFix[this.toLowerCase()] = this
  });
  var he = /[\t\r\n\f]/g;
  ot.fn.extend({
    addClass: function (t) {
      var e, i, n, s, o, r, a, l = 0;
      if (ot.isFunction(t))return this.each(function (e) {
        ot(this).addClass(t.call(this, e, I(this)))
      });
      if ("string" == typeof t && t)for (e = t.match(Ct) || []; i = this[l++];)if (s = I(i), n = 1 === i.nodeType && (" " + s + " ").replace(he, " ")) {
        for (r = 0; o = e[r++];)n.indexOf(" " + o + " ") < 0 && (n += o + " ");
        a = ot.trim(n), s !== a && i.setAttribute("class", a)
      }
      return this
    }, removeClass: function (t) {
      var e, i, n, s, o, r, a, l = 0;
      if (ot.isFunction(t))return this.each(function (e) {
        ot(this).removeClass(t.call(this, e, I(this)))
      });
      if (!arguments.length)return this.attr("class", "");
      if ("string" == typeof t && t)for (e = t.match(Ct) || []; i = this[l++];)if (s = I(i), n = 1 === i.nodeType && (" " + s + " ").replace(he, " ")) {
        for (r = 0; o = e[r++];)for (; n.indexOf(" " + o + " ") > -1;)n = n.replace(" " + o + " ", " ");
        a = ot.trim(n), s !== a && i.setAttribute("class", a)
      }
      return this
    }, toggleClass: function (t, e) {
      var i = typeof t;
      return "boolean" == typeof e && "string" === i ? e ? this.addClass(t) : this.removeClass(t) : ot.isFunction(t) ? this.each(function (i) {
            ot(this).toggleClass(t.call(this, i, I(this), e), e)
          }) : this.each(function () {
            var e, n, s, o;
            if ("string" === i)for (n = 0, s = ot(this), o = t.match(Ct) || []; e = o[n++];)s.hasClass(e) ? s.removeClass(e) : s.addClass(e); else void 0 !== t && "boolean" !== i || (e = I(this), e && Tt.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || t === !1 ? "" : Tt.get(this, "__className__") || ""))
          })
    }, hasClass: function (t) {
      var e, i, n = 0;
      for (e = " " + t + " "; i = this[n++];)if (1 === i.nodeType && (" " + I(i) + " ").replace(he, " ").indexOf(e) > -1)return !0;
      return !1
    }
  });
  var fe = /\r/g, pe = /[\x20\t\r\n\f]+/g;
  ot.fn.extend({
    val: function (t) {
      var e, i, n, s = this[0];
      {
        if (arguments.length)return n = ot.isFunction(t), this.each(function (i) {
          var s;
          1 === this.nodeType && (s = n ? t.call(this, i, ot(this).val()) : t, null == s ? s = "" : "number" == typeof s ? s += "" : ot.isArray(s) && (s = ot.map(s, function (t) {
                return null == t ? "" : t + ""
              })), e = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()], e && "set" in e && void 0 !== e.set(this, s, "value") || (this.value = s))
        });
        if (s)return e = ot.valHooks[s.type] || ot.valHooks[s.nodeName.toLowerCase()], e && "get" in e && void 0 !== (i = e.get(s, "value")) ? i : (i = s.value, "string" == typeof i ? i.replace(fe, "") : null == i ? "" : i)
      }
    }
  }), ot.extend({
    valHooks: {
      option: {
        get: function (t) {
          var e = ot.find.attr(t, "value");
          return null != e ? e : ot.trim(ot.text(t)).replace(pe, " ")
        }
      }, select: {
        get: function (t) {
          for (var e, i, n = t.options, s = t.selectedIndex, o = "select-one" === t.type || s < 0, r = o ? null : [], a = o ? s + 1 : n.length, l = s < 0 ? a : o ? s : 0; l < a; l++)if (i = n[l], (i.selected || l === s) && (nt.optDisabled ? !i.disabled : null === i.getAttribute("disabled")) && (!i.parentNode.disabled || !ot.nodeName(i.parentNode, "optgroup"))) {
            if (e = ot(i).val(), o)return e;
            r.push(e)
          }
          return r
        }, set: function (t, e) {
          for (var i, n, s = t.options, o = ot.makeArray(e), r = s.length; r--;)n = s[r], (n.selected = ot.inArray(ot.valHooks.option.get(n), o) > -1) && (i = !0);
          return i || (t.selectedIndex = -1), o
        }
      }
    }
  }), ot.each(["radio", "checkbox"], function () {
    ot.valHooks[this] = {
      set: function (t, e) {
        if (ot.isArray(e))return t.checked = ot.inArray(ot(t).val(), e) > -1
      }
    }, nt.checkOn || (ot.valHooks[this].get = function (t) {
      return null === t.getAttribute("value") ? "on" : t.value
    })
  });
  var ge = /^(?:focusinfocus|focusoutblur)$/;
  ot.extend(ot.event, {
    trigger: function (e, i, n, s) {
      var o, r, a, l, u, d, c, h = [n || Q], f = it.call(e, "type") ? e.type : e, p = it.call(e, "namespace") ? e.namespace.split(".") : [];
      if (r = a = n = n || Q, 3 !== n.nodeType && 8 !== n.nodeType && !ge.test(f + ot.event.triggered) && (f.indexOf(".") > -1 && (p = f.split("."), f = p.shift(), p.sort()), u = f.indexOf(":") < 0 && "on" + f, e = e[ot.expando] ? e : new ot.Event(f, "object" == typeof e && e), e.isTrigger = s ? 2 : 3, e.namespace = p.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), i = null == i ? [e] : ot.makeArray(i, [e]), c = ot.event.special[f] || {}, s || !c.trigger || c.trigger.apply(n, i) !== !1)) {
        if (!s && !c.noBubble && !ot.isWindow(n)) {
          for (l = c.delegateType || f, ge.test(l + f) || (r = r.parentNode); r; r = r.parentNode)h.push(r), a = r;
          a === (n.ownerDocument || Q) && h.push(a.defaultView || a.parentWindow || t)
        }
        for (o = 0; (r = h[o++]) && !e.isPropagationStopped();)e.type = o > 1 ? l : c.bindType || f, d = (Tt.get(r, "events") || {})[e.type] && Tt.get(r, "handle"), d && d.apply(r, i), d = u && r[u], d && d.apply && xt(r) && (e.result = d.apply(r, i), e.result === !1 && e.preventDefault());
        return e.type = f, s || e.isDefaultPrevented() || c._default && c._default.apply(h.pop(), i) !== !1 || !xt(n) || u && ot.isFunction(n[f]) && !ot.isWindow(n) && (a = n[u], a && (n[u] = null), ot.event.triggered = f, n[f](), ot.event.triggered = void 0, a && (n[u] = a)), e.result
      }
    }, simulate: function (t, e, i) {
      var n = ot.extend(new ot.Event, i, { type: t, isSimulated: !0 });
      ot.event.trigger(n, null, e)
    }
  }), ot.fn.extend({
    trigger: function (t, e) {
      return this.each(function () {
        ot.event.trigger(t, e, this)
      })
    }, triggerHandler: function (t, e) {
      var i = this[0];
      if (i)return ot.event.trigger(t, e, i, !0)
    }
  }), ot.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (t, e) {
    ot.fn[e] = function (t, i) {
      return arguments.length > 0 ? this.on(e, null, t, i) : this.trigger(e)
    }
  }), ot.fn.extend({
    hover: function (t, e) {
      return this.mouseenter(t).mouseleave(e || t)
    }
  }), nt.focusin = "onfocusin" in t, nt.focusin || ot.each({ focus: "focusin", blur: "focusout" }, function (t, e) {
    var i = function (t) {
      ot.event.simulate(e, t.target, ot.event.fix(t))
    };
    ot.event.special[e] = {
      setup: function () {
        var n = this.ownerDocument || this, s = Tt.access(n, e);
        s || n.addEventListener(t, i, !0), Tt.access(n, e, (s || 0) + 1)
      }, teardown: function () {
        var n = this.ownerDocument || this, s = Tt.access(n, e) - 1;
        s ? Tt.access(n, e, s) : (n.removeEventListener(t, i, !0), Tt.remove(n, e))
      }
    }
  });
  var me = t.location, ve = ot.now(), ye = /\?/;
  ot.parseJSON = function (t) {
    return JSON.parse(t + "")
  }, ot.parseXML = function (e) {
    var i;
    if (!e || "string" != typeof e)return null;
    try {
      i = (new t.DOMParser).parseFromString(e, "text/xml")
    } catch (n) {
      i = void 0
    }
    return i && !i.getElementsByTagName("parsererror").length || ot.error("Invalid XML: " + e), i
  };
  var be = /#.*$/, we = /([?&])_=[^&]*/, Ce = /^(.*?):[ \t]*([^\r\n]*)$/gm, ke = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, $e = /^(?:GET|HEAD)$/, xe = /^\/\//, Te = {}, Se = {}, Fe = "*/".concat("*"), _e = Q.createElement("a");
  _e.href = me.href, ot.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: me.href,
      type: "GET",
      isLocal: ke.test(me.protocol),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": Fe,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
      responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" },
      converters: { "* text": String, "text html": !0, "text json": ot.parseJSON, "text xml": ot.parseXML },
      flatOptions: { url: !0, context: !0 }
    },
    ajaxSetup: function (t, e) {
      return e ? B(B(t, ot.ajaxSettings), e) : B(ot.ajaxSettings, t)
    },
    ajaxPrefilter: N(Te),
    ajaxTransport: N(Se),
    ajax: function (e, i) {
      function n(e, i, n, a) {
        var u, c, y, b, C, $ = i;
        2 !== w && (w = 2, l && t.clearTimeout(l), s = void 0, r = a || "", k.readyState = e > 0 ? 4 : 0, u = e >= 200 && e < 300 || 304 === e, n && (b = W(h, k, n)), b = K(h, b, k, u), u ? (h.ifModified && (C = k.getResponseHeader("Last-Modified"), C && (ot.lastModified[o] = C), C = k.getResponseHeader("etag"), C && (ot.etag[o] = C)), 204 === e || "HEAD" === h.type ? $ = "nocontent" : 304 === e ? $ = "notmodified" : ($ = b.state, c = b.data, y = b.error, u = !y)) : (y = $, !e && $ || ($ = "error", e < 0 && (e = 0))), k.status = e, k.statusText = (i || $) + "", u ? g.resolveWith(f, [c, $, k]) : g.rejectWith(f, [k, $, y]), k.statusCode(v), v = void 0, d && p.trigger(u ? "ajaxSuccess" : "ajaxError", [k, h, u ? c : y]), m.fireWith(f, [k, $]), d && (p.trigger("ajaxComplete", [k, h]), --ot.active || ot.event.trigger("ajaxStop")))
      }

      "object" == typeof e && (i = e, e = void 0), i = i || {};
      var s, o, r, a, l, u, d, c, h = ot.ajaxSetup({}, i), f = h.context || h, p = h.context && (f.nodeType || f.jquery) ? ot(f) : ot.event, g = ot.Deferred(), m = ot.Callbacks("once memory"), v = h.statusCode || {}, y = {}, b = {}, w = 0, C = "canceled", k = {
        readyState: 0,
        getResponseHeader: function (t) {
          var e;
          if (2 === w) {
            if (!a)for (a = {}; e = Ce.exec(r);)a[e[1].toLowerCase()] = e[2];
            e = a[t.toLowerCase()]
          }
          return null == e ? null : e
        },
        getAllResponseHeaders: function () {
          return 2 === w ? r : null
        },
        setRequestHeader: function (t, e) {
          var i = t.toLowerCase();
          return w || (t = b[i] = b[i] || t, y[t] = e), this
        },
        overrideMimeType: function (t) {
          return w || (h.mimeType = t), this
        },
        statusCode: function (t) {
          var e;
          if (t)if (w < 2)for (e in t)v[e] = [v[e], t[e]]; else k.always(t[k.status]);
          return this
        },
        abort: function (t) {
          var e = t || C;
          return s && s.abort(e), n(0, e), this
        }
      };
      if (g.promise(k).complete = m.add, k.success = k.done, k.error = k.fail, h.url = ((e || h.url || me.href) + "").replace(be, "").replace(xe, me.protocol + "//"), h.type = i.method || i.type || h.method || h.type, h.dataTypes = ot.trim(h.dataType || "*").toLowerCase().match(Ct) || [""], null == h.crossDomain) {
        u = Q.createElement("a");
        try {
          u.href = h.url, u.href = u.href, h.crossDomain = _e.protocol + "//" + _e.host != u.protocol + "//" + u.host
        } catch ($) {
          h.crossDomain = !0
        }
      }
      if (h.data && h.processData && "string" != typeof h.data && (h.data = ot.param(h.data, h.traditional)), j(Te, h, i, k), 2 === w)return k;
      d = ot.event && h.global, d && 0 === ot.active++ && ot.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !$e.test(h.type), o = h.url, h.hasContent || (h.data && (o = h.url += (ye.test(o) ? "&" : "?") + h.data, delete h.data), h.cache === !1 && (h.url = we.test(o) ? o.replace(we, "$1_=" + ve++) : o + (ye.test(o) ? "&" : "?") + "_=" + ve++)), h.ifModified && (ot.lastModified[o] && k.setRequestHeader("If-Modified-Since", ot.lastModified[o]), ot.etag[o] && k.setRequestHeader("If-None-Match", ot.etag[o])), (h.data && h.hasContent && h.contentType !== !1 || i.contentType) && k.setRequestHeader("Content-Type", h.contentType), k.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Fe + "; q=0.01" : "") : h.accepts["*"]);
      for (c in h.headers)k.setRequestHeader(c, h.headers[c]);
      if (h.beforeSend && (h.beforeSend.call(f, k, h) === !1 || 2 === w))return k.abort();
      C = "abort";
      for (c in{ success: 1, error: 1, complete: 1 })k[c](h[c]);
      if (s = j(Se, h, i, k)) {
        if (k.readyState = 1, d && p.trigger("ajaxSend", [k, h]), 2 === w)return k;
        h.async && h.timeout > 0 && (l = t.setTimeout(function () {
          k.abort("timeout")
        }, h.timeout));
        try {
          w = 1, s.send(y, n)
        } catch ($) {
          if (!(w < 2))throw $;
          n(-1, $)
        }
      } else n(-1, "No Transport");
      return k
    },
    getJSON: function (t, e, i) {
      return ot.get(t, e, i, "json")
    },
    getScript: function (t, e) {
      return ot.get(t, void 0, e, "script")
    }
  }), ot.each(["get", "post"], function (t, e) {
    ot[e] = function (t, i, n, s) {
      return ot.isFunction(i) && (s = s || n, n = i, i = void 0), ot.ajax(ot.extend({
        url: t,
        type: e,
        dataType: s,
        data: i,
        success: n
      }, ot.isPlainObject(t) && t))
    }
  }), ot._evalUrl = function (t) {
    return ot.ajax({ url: t, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 })
  }, ot.fn.extend({
    wrapAll: function (t) {
      var e;
      return ot.isFunction(t) ? this.each(function (e) {
          ot(this).wrapAll(t.call(this, e))
        }) : (this[0] && (e = ot(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function () {
          for (var t = this; t.firstElementChild;)t = t.firstElementChild;
          return t
        }).append(this)), this)
    }, wrapInner: function (t) {
      return ot.isFunction(t) ? this.each(function (e) {
          ot(this).wrapInner(t.call(this, e))
        }) : this.each(function () {
          var e = ot(this), i = e.contents();
          i.length ? i.wrapAll(t) : e.append(t)
        })
    }, wrap: function (t) {
      var e = ot.isFunction(t);
      return this.each(function (i) {
        ot(this).wrapAll(e ? t.call(this, i) : t)
      })
    }, unwrap: function () {
      return this.parent().each(function () {
        ot.nodeName(this, "body") || ot(this).replaceWith(this.childNodes)
      }).end()
    }
  }), ot.expr.filters.hidden = function (t) {
    return !ot.expr.filters.visible(t)
  }, ot.expr.filters.visible = function (t) {
    return t.offsetWidth > 0 || t.offsetHeight > 0 || t.getClientRects().length > 0
  };
  var Ae = /%20/g, ze = /\[\]$/, Ee = /\r?\n/g, De = /^(?:submit|button|image|reset|file)$/i, Oe = /^(?:input|select|textarea|keygen)/i;
  ot.param = function (t, e) {
    var i, n = [], s = function (t, e) {
      e = ot.isFunction(e) ? e() : null == e ? "" : e, n[n.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
    };
    if (void 0 === e && (e = ot.ajaxSettings && ot.ajaxSettings.traditional), ot.isArray(t) || t.jquery && !ot.isPlainObject(t)) ot.each(t, function () {
      s(this.name, this.value)
    }); else for (i in t)U(i, t[i], e, s);
    return n.join("&").replace(Ae, "+")
  }, ot.fn.extend({
    serialize: function () {
      return ot.param(this.serializeArray())
    }, serializeArray: function () {
      return this.map(function () {
        var t = ot.prop(this, "elements");
        return t ? ot.makeArray(t) : this
      }).filter(function () {
        var t = this.type;
        return this.name && !ot(this).is(":disabled") && Oe.test(this.nodeName) && !De.test(t) && (this.checked || !Ot.test(t))
      }).map(function (t, e) {
        var i = ot(this).val();
        return null == i ? null : ot.isArray(i) ? ot.map(i, function (t) {
              return { name: e.name, value: t.replace(Ee, "\r\n") }
            }) : { name: e.name, value: i.replace(Ee, "\r\n") }
      }).get()
    }
  }), ot.ajaxSettings.xhr = function () {
    try {
      return new t.XMLHttpRequest
    } catch (e) {
    }
  };
  var Pe = { 0: 200, 1223: 204 }, He = ot.ajaxSettings.xhr();
  nt.cors = !!He && "withCredentials" in He, nt.ajax = He = !!He, ot.ajaxTransport(function (e) {
    var i, n;
    if (nt.cors || He && !e.crossDomain)return {
      send: function (s, o) {
        var r, a = e.xhr();
        if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)for (r in e.xhrFields)a[r] = e.xhrFields[r];
        e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || s["X-Requested-With"] || (s["X-Requested-With"] = "XMLHttpRequest");
        for (r in s)a.setRequestHeader(r, s[r]);
        i = function (t) {
          return function () {
            i && (i = n = a.onload = a.onerror = a.onabort = a.onreadystatechange = null, "abort" === t ? a.abort() : "error" === t ? "number" != typeof a.status ? o(0, "error") : o(a.status, a.statusText) : o(Pe[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? { binary: a.response } : { text: a.responseText }, a.getAllResponseHeaders()))
          }
        }, a.onload = i(), n = a.onerror = i("error"), void 0 !== a.onabort ? a.onabort = n : a.onreadystatechange = function () {
            4 === a.readyState && t.setTimeout(function () {
              i && n()
            })
          }, i = i("abort");
        try {
          a.send(e.hasContent && e.data || null)
        } catch (l) {
          if (i)throw l
        }
      }, abort: function () {
        i && i()
      }
    }
  }), ot.ajaxSetup({
    accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" },
    contents: { script: /\b(?:java|ecma)script\b/ },
    converters: {
      "text script": function (t) {
        return ot.globalEval(t), t
      }
    }
  }), ot.ajaxPrefilter("script", function (t) {
    void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET")
  }), ot.ajaxTransport("script", function (t) {
    if (t.crossDomain) {
      var e, i;
      return {
        send: function (n, s) {
          e = ot("<script>").prop({ charset: t.scriptCharset, src: t.url }).on("load error", i = function (t) {
            e.remove(), i = null, t && s("error" === t.type ? 404 : 200, t.type)
          }), Q.head.appendChild(e[0])
        }, abort: function () {
          i && i()
        }
      }
    }
  });
  var Re = [], Me = /(=)\?(?=&|$)|\?\?/;
  ot.ajaxSetup({
    jsonp: "callback", jsonpCallback: function () {
      var t = Re.pop() || ot.expando + "_" + ve++;
      return this[t] = !0, t
    }
  }), ot.ajaxPrefilter("json jsonp", function (e, i, n) {
    var s, o, r, a = e.jsonp !== !1 && (Me.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Me.test(e.data) && "data");
    if (a || "jsonp" === e.dataTypes[0])return s = e.jsonpCallback = ot.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Me, "$1" + s) : e.jsonp !== !1 && (e.url += (ye.test(e.url) ? "&" : "?") + e.jsonp + "=" + s), e.converters["script json"] = function () {
      return r || ot.error(s + " was not called"), r[0]
    }, e.dataTypes[0] = "json", o = t[s], t[s] = function () {
      r = arguments
    }, n.always(function () {
      void 0 === o ? ot(t).removeProp(s) : t[s] = o, e[s] && (e.jsonpCallback = i.jsonpCallback, Re.push(s)), r && ot.isFunction(o) && o(r[0]), r = o = void 0
    }), "script"
  }), ot.parseHTML = function (t, e, i) {
    if (!t || "string" != typeof t)return null;
    "boolean" == typeof e && (i = e, e = !1), e = e || Q;
    var n = pt.exec(t), s = !i && [];
    return n ? [e.createElement(n[1])] : (n = h([t], e, s), s && s.length && ot(s).remove(), ot.merge([], n.childNodes))
  };
  var Le = ot.fn.load;
  ot.fn.load = function (t, e, i) {
    if ("string" != typeof t && Le)return Le.apply(this, arguments);
    var n, s, o, r = this, a = t.indexOf(" ");
    return a > -1 && (n = ot.trim(t.slice(a)), t = t.slice(0, a)), ot.isFunction(e) ? (i = e, e = void 0) : e && "object" == typeof e && (s = "POST"), r.length > 0 && ot.ajax({
      url: t,
      type: s || "GET",
      dataType: "html",
      data: e
    }).done(function (t) {
      o = arguments, r.html(n ? ot("<div>").append(ot.parseHTML(t)).find(n) : t)
    }).always(i && function (t, e) {
        r.each(function () {
          i.apply(this, o || [t.responseText, e, t])
        })
      }), this
  }, ot.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (t, e) {
    ot.fn[e] = function (t) {
      return this.on(e, t)
    }
  }), ot.expr.filters.animated = function (t) {
    return ot.grep(ot.timers, function (e) {
      return t === e.elem
    }).length
  }, ot.offset = {
    setOffset: function (t, e, i) {
      var n, s, o, r, a, l, u, d = ot.css(t, "position"), c = ot(t), h = {};
      "static" === d && (t.style.position = "relative"), a = c.offset(), o = ot.css(t, "top"), l = ot.css(t, "left"), u = ("absolute" === d || "fixed" === d) && (o + l).indexOf("auto") > -1, u ? (n = c.position(), r = n.top, s = n.left) : (r = parseFloat(o) || 0, s = parseFloat(l) || 0), ot.isFunction(e) && (e = e.call(t, i, ot.extend({}, a))), null != e.top && (h.top = e.top - a.top + r), null != e.left && (h.left = e.left - a.left + s), "using" in e ? e.using.call(t, h) : c.css(h)
    }
  }, ot.fn.extend({
    offset: function (t) {
      if (arguments.length)return void 0 === t ? this : this.each(function (e) {
          ot.offset.setOffset(this, t, e)
        });
      var e, i, n = this[0], s = { top: 0, left: 0 }, o = n && n.ownerDocument;
      if (o)return e = o.documentElement, ot.contains(e, n) ? (s = n.getBoundingClientRect(), i = Z(o), {
          top: s.top + i.pageYOffset - e.clientTop,
          left: s.left + i.pageXOffset - e.clientLeft
        }) : s
    }, position: function () {
      if (this[0]) {
        var t, e, i = this[0], n = { top: 0, left: 0 };
        return "fixed" === ot.css(i, "position") ? e = i.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), ot.nodeName(t[0], "html") || (n = t.offset()), n.top += ot.css(t[0], "borderTopWidth", !0), n.left += ot.css(t[0], "borderLeftWidth", !0)), {
          top: e.top - n.top - ot.css(i, "marginTop", !0),
          left: e.left - n.left - ot.css(i, "marginLeft", !0)
        }
      }
    }, offsetParent: function () {
      return this.map(function () {
        for (var t = this.offsetParent; t && "static" === ot.css(t, "position");)t = t.offsetParent;
        return t || Xt
      })
    }
  }), ot.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (t, e) {
    var i = "pageYOffset" === e;
    ot.fn[t] = function (n) {
      return $t(this, function (t, n, s) {
        var o = Z(t);
        return void 0 === s ? o ? o[e] : t[n] : void(o ? o.scrollTo(i ? o.pageXOffset : s, i ? s : o.pageYOffset) : t[n] = s)
      }, t, n, arguments.length)
    }
  }), ot.each(["top", "left"], function (t, e) {
    ot.cssHooks[e] = F(nt.pixelPosition, function (t, i) {
      if (i)return i = S(t, e), Qt.test(i) ? ot(t).position()[e] + "px" : i
    })
  }), ot.each({ Height: "height", Width: "width" }, function (t, e) {
    ot.each({ padding: "inner" + t, content: e, "": "outer" + t }, function (i, n) {
      ot.fn[n] = function (n, s) {
        var o = arguments.length && (i || "boolean" != typeof n), r = i || (n === !0 || s === !0 ? "margin" : "border");
        return $t(this, function (e, i, n) {
          var s;
          return ot.isWindow(e) ? e.document.documentElement["client" + t] : 9 === e.nodeType ? (s = e.documentElement, Math.max(e.body["scroll" + t], s["scroll" + t], e.body["offset" + t], s["offset" + t], s["client" + t])) : void 0 === n ? ot.css(e, i, r) : ot.style(e, i, n, r)
        }, e, o ? n : void 0, o, null)
      }
    })
  }), ot.fn.extend({
    bind: function (t, e, i) {
      return this.on(t, null, e, i)
    }, unbind: function (t, e) {
      return this.off(t, null, e)
    }, delegate: function (t, e, i, n) {
      return this.on(e, t, i, n)
    }, undelegate: function (t, e, i) {
      return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", i)
    }, size: function () {
      return this.length
    }
  }), ot.fn.andSelf = ot.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
    return ot
  });
  var qe = t.jQuery, Ie = t.$;
  return ot.noConflict = function (e) {
    return t.$ === ot && (t.$ = Ie), e && t.jQuery === ot && (t.jQuery = qe), ot
  }, e || (t.jQuery = t.$ = ot), ot
}), function (t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function (t) {
  t.extend(t.fn, {
    validate: function (e) {
      if (!this.length)return void(e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
      var i = t.data(this[0], "validator");
      return i ? i : (this.attr("novalidate", "novalidate"), i = new t.validator(e, this[0]), t.data(this[0], "validator", i), i.settings.onsubmit && (this.on("click.validate", ":submit", function (e) {
          i.settings.submitHandler && (i.submitButton = e.target), t(this).hasClass("cancel") && (i.cancelSubmit = !0), void 0 !== t(this).attr("formnovalidate") && (i.cancelSubmit = !0)
        }), this.on("submit.validate", function (e) {
          function n() {
            var n, s;
            return !i.settings.submitHandler || (i.submitButton && (n = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)), s = i.settings.submitHandler.call(i, i.currentForm, e), i.submitButton && n.remove(), void 0 !== s && s)
          }

          return i.settings.debug && e.preventDefault(), i.cancelSubmit ? (i.cancelSubmit = !1, n()) : i.form() ? i.pendingRequest ? (i.formSubmitted = !0, !1) : n() : (i.focusInvalid(), !1)
        })), i)
    }, valid: function () {
      var e, i, n;
      return t(this[0]).is("form") ? e = this.validate().form() : (n = [], e = !0, i = t(this[0].form).validate(), this.each(function () {
          e = i.element(this) && e, e || (n = n.concat(i.errorList))
        }), i.errorList = n), e
    }, rules: function (e, i) {
      var n, s, o, r, a, l, u = this[0];
      if (null != u && null != u.form) {
        if (e)switch (n = t.data(u.form, "validator").settings, s = n.rules, o = t.validator.staticRules(u), e) {
          case"add":
            t.extend(o, t.validator.normalizeRule(i)), delete o.messages, s[u.name] = o, i.messages && (n.messages[u.name] = t.extend(n.messages[u.name], i.messages));
            break;
          case"remove":
            return i ? (l = {}, t.each(i.split(/\s/), function (e, i) {
                l[i] = o[i], delete o[i], "required" === i && t(u).removeAttr("aria-required")
              }), l) : (delete s[u.name], o)
        }
        return r = t.validator.normalizeRules(t.extend({}, t.validator.classRules(u), t.validator.attributeRules(u), t.validator.dataRules(u), t.validator.staticRules(u)), u), r.required && (a = r.required, delete r.required, r = t.extend({ required: a }, r), t(u).attr("aria-required", "true")), r.remote && (a = r.remote, delete r.remote, r = t.extend(r, { remote: a })), r
      }
    }
  }), t.extend(t.expr.pseudos || t.expr[":"], {
    blank: function (e) {
      return !t.trim("" + t(e).val())
    }, filled: function (e) {
      var i = t(e).val();
      return null !== i && !!t.trim("" + i)
    }, unchecked: function (e) {
      return !t(e).prop("checked")
    }
  }), t.validator = function (e, i) {
    this.settings = t.extend(!0, {}, t.validator.defaults, e), this.currentForm = i, this.init()
  }, t.validator.format = function (e, i) {
    return 1 === arguments.length ? function () {
        var i = t.makeArray(arguments);
        return i.unshift(e), t.validator.format.apply(this, i)
      } : void 0 === i ? e : (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)), i.constructor !== Array && (i = [i]), t.each(i, function (t, i) {
          e = e.replace(new RegExp("\\{" + t + "\\}", "g"), function () {
            return i
          })
        }), e)
  }, t.extend(t.validator, {
    defaults: {
      messages: {},
      groups: {},
      rules: {},
      errorClass: "error",
      pendingClass: "pending",
      validClass: "valid",
      errorElement: "label",
      focusCleanup: !1,
      focusInvalid: !0,
      errorContainer: t([]),
      errorLabelContainer: t([]),
      onsubmit: !0,
      ignore: ":hidden",
      ignoreTitle: !1,
      onfocusin: function (t) {
        this.lastActive = t, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(t)))
      },
      onfocusout: function (t) {
        this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
      },
      onkeyup: function (e, i) {
        var n = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
        9 === i.which && "" === this.elementValue(e) || t.inArray(i.keyCode, n) !== -1 || (e.name in this.submitted || e.name in this.invalid) && this.element(e)
      },
      onclick: function (t) {
        t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
      },
      highlight: function (e, i, n) {
        "radio" === e.type ? this.findByName(e.name).addClass(i).removeClass(n) : t(e).addClass(i).removeClass(n)
      },
      unhighlight: function (e, i, n) {
        "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(n) : t(e).removeClass(i).addClass(n)
      }
    },
    setDefaults: function (e) {
      t.extend(t.validator.defaults, e)
    },
    messages: {
      required: "This field is required.",
      remote: "Please fix this field.",
      email: "Please enter a valid email address.",
      url: "Please enter a valid URL.",
      date: "Please enter a valid date.",
      dateISO: "Please enter a valid date (ISO).",
      number: "Please enter a valid number.",
      digits: "Please enter only digits.",
      equalTo: "Please enter the same value again.",
      maxlength: t.validator.format("Please enter no more than {0} characters."),
      minlength: t.validator.format("Please enter at least {0} characters."),
      rangelength: t.validator.format("Please enter a value between {0} and {1} characters long."),
      range: t.validator.format("Please enter a value between {0} and {1}."),
      max: t.validator.format("Please enter a value less than or equal to {0}."),
      min: t.validator.format("Please enter a value greater than or equal to {0}."),
      step: t.validator.format("Please enter a multiple of {0}.")
    },
    autoCreateRanges: !1,
    prototype: {
      init: function () {
        function e(e) {
          !this.form && this.hasAttribute("contenteditable") && (this.form = t(this).closest("form")[0]);
          var i = t.data(this.form, "validator"), n = "on" + e.type.replace(/^validate/, ""), s = i.settings;
          s[n] && !t(this).is(s.ignore) && s[n].call(i, this, e)
        }

        this.labelContainer = t(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm), this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
        var i, n = this.groups = {};
        t.each(this.settings.groups, function (e, i) {
          "string" == typeof i && (i = i.split(/\s/)), t.each(i, function (t, i) {
            n[i] = e
          })
        }), i = this.settings.rules, t.each(i, function (e, n) {
          i[e] = t.validator.normalizeRule(n)
        }), t(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", e).on("click.validate", "select, option, [type='radio'], [type='checkbox']", e), this.settings.invalidHandler && t(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler), t(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
      }, form: function () {
        return this.checkForm(), t.extend(this.submitted, this.errorMap), this.invalid = t.extend({}, this.errorMap), this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
      }, checkForm: function () {
        this.prepareForm();
        for (var t = 0, e = this.currentElements = this.elements(); e[t]; t++)this.check(e[t]);
        return this.valid()
      }, element: function (e) {
        var i, n, s = this.clean(e), o = this.validationTargetFor(s), r = this, a = !0;
        return void 0 === o ? delete this.invalid[s.name] : (this.prepareElement(o), this.currentElements = t(o), n = this.groups[o.name], n && t.each(this.groups, function (t, e) {
            e === n && t !== o.name && (s = r.validationTargetFor(r.clean(r.findByName(t))), s && s.name in r.invalid && (r.currentElements.push(s), a = r.check(s) && a))
          }), i = this.check(o) !== !1, a = a && i, i ? this.invalid[o.name] = !1 : this.invalid[o.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), t(e).attr("aria-invalid", !i)), a
      }, showErrors: function (e) {
        if (e) {
          var i = this;
          t.extend(this.errorMap, e), this.errorList = t.map(this.errorMap, function (t, e) {
            return { message: t, element: i.findByName(e)[0] }
          }), this.successList = t.grep(this.successList, function (t) {
            return !(t.name in e)
          })
        }
        this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
      }, resetForm: function () {
        t.fn.resetForm && t(this.currentForm).resetForm(),
          this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
        var e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
        this.resetElements(e)
      }, resetElements: function (t) {
        var e;
        if (this.settings.unhighlight)for (e = 0; t[e]; e++)this.settings.unhighlight.call(this, t[e], this.settings.errorClass, ""), this.findByName(t[e].name).removeClass(this.settings.validClass); else t.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
      }, numberOfInvalids: function () {
        return this.objectLength(this.invalid)
      }, objectLength: function (t) {
        var e, i = 0;
        for (e in t)t[e] && i++;
        return i
      }, hideErrors: function () {
        this.hideThese(this.toHide)
      }, hideThese: function (t) {
        t.not(this.containers).text(""), this.addWrapper(t).hide()
      }, valid: function () {
        return 0 === this.size()
      }, size: function () {
        return this.errorList.length
      }, focusInvalid: function () {
        if (this.settings.focusInvalid)try {
          t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
        } catch (e) {
        }
      }, findLastActive: function () {
        var e = this.lastActive;
        return e && 1 === t.grep(this.errorList, function (t) {
            return t.element.name === e.name
          }).length && e
      }, elements: function () {
        var e = this, i = {};
        return t(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
          var n = this.name || t(this).attr("name");
          return !n && e.settings.debug && window.console && console.error("%o has no name assigned", this), this.hasAttribute("contenteditable") && (this.form = t(this).closest("form")[0]), !(n in i || !e.objectLength(t(this).rules())) && (i[n] = !0, !0)
        })
      }, clean: function (e) {
        return t(e)[0]
      }, errors: function () {
        var e = this.settings.errorClass.split(" ").join(".");
        return t(this.settings.errorElement + "." + e, this.errorContext)
      }, resetInternals: function () {
        this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = t([]), this.toHide = t([])
      }, reset: function () {
        this.resetInternals(), this.currentElements = t([])
      }, prepareForm: function () {
        this.reset(), this.toHide = this.errors().add(this.containers)
      }, prepareElement: function (t) {
        this.reset(), this.toHide = this.errorsFor(t)
      }, elementValue: function (e) {
        var i, n, s = t(e), o = e.type;
        return "radio" === o || "checkbox" === o ? this.findByName(e.name).filter(":checked").val() : "number" === o && "undefined" != typeof e.validity ? e.validity.badInput ? "NaN" : s.val() : (i = e.hasAttribute("contenteditable") ? s.text() : s.val(), "file" === o ? "C:\\fakepath\\" === i.substr(0, 12) ? i.substr(12) : (n = i.lastIndexOf("/"), n >= 0 ? i.substr(n + 1) : (n = i.lastIndexOf("\\"), n >= 0 ? i.substr(n + 1) : i)) : "string" == typeof i ? i.replace(/\r/g, "") : i)
      }, check: function (e) {
        e = this.validationTargetFor(this.clean(e));
        var i, n, s, o = t(e).rules(), r = t.map(o, function (t, e) {
          return e
        }).length, a = !1, l = this.elementValue(e);
        if ("function" == typeof o.normalizer) {
          if (l = o.normalizer.call(e, l), "string" != typeof l)throw new TypeError("The normalizer should return a string value.");
          delete o.normalizer
        }
        for (n in o) {
          s = { method: n, parameters: o[n] };
          try {
            if (i = t.validator.methods[n].call(this, l, e, s.parameters), "dependency-mismatch" === i && 1 === r) {
              a = !0;
              continue
            }
            if (a = !1, "pending" === i)return void(this.toHide = this.toHide.not(this.errorsFor(e)));
            if (!i)return this.formatAndAdd(e, s), !1
          } catch (u) {
            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + s.method + "' method.", u), u instanceof TypeError && (u.message += ".  Exception occurred when checking element " + e.id + ", check the '" + s.method + "' method."), u
          }
        }
        if (!a)return this.objectLength(o) && this.successList.push(e), !0
      }, customDataMessage: function (e, i) {
        return t(e).data("msg" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()) || t(e).data("msg")
      }, customMessage: function (t, e) {
        var i = this.settings.messages[t];
        return i && (i.constructor === String ? i : i[e])
      }, findDefined: function () {
        for (var t = 0; t < arguments.length; t++)if (void 0 !== arguments[t])return arguments[t]
      }, defaultMessage: function (e, i) {
        "string" == typeof i && (i = { method: i });
        var n = this.findDefined(this.customMessage(e.name, i.method), this.customDataMessage(e, i.method), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[i.method], "<strong>Warning: No message defined for " + e.name + "</strong>"), s = /\$?\{(\d+)\}/g;
        return "function" == typeof n ? n = n.call(this, i.parameters, e) : s.test(n) && (n = t.validator.format(n.replace(s, "{$1}"), i.parameters)), n
      }, formatAndAdd: function (t, e) {
        var i = this.defaultMessage(t, e);
        this.errorList.push({
          message: i,
          element: t,
          method: e.method
        }), this.errorMap[t.name] = i, this.submitted[t.name] = i
      }, addWrapper: function (t) {
        return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))), t
      }, defaultShowErrors: function () {
        var t, e, i;
        for (t = 0; this.errorList[t]; t++)i = this.errorList[t], this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass), this.showLabel(i.element, i.message);
        if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)for (t = 0; this.successList[t]; t++)this.showLabel(this.successList[t]);
        if (this.settings.unhighlight)for (t = 0, e = this.validElements(); e[t]; t++)this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
        this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
      }, validElements: function () {
        return this.currentElements.not(this.invalidElements())
      }, invalidElements: function () {
        return t(this.errorList).map(function () {
          return this.element
        })
      }, showLabel: function (e, i) {
        var n, s, o, r, a = this.errorsFor(e), l = this.idOrName(e), u = t(e).attr("aria-describedby");
        a.length ? (a.removeClass(this.settings.validClass).addClass(this.settings.errorClass), a.html(i)) : (a = t("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass).html(i || ""), n = a, this.settings.wrapper && (n = a.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(n) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, n, t(e)) : n.insertAfter(e), a.is("label") ? a.attr("for", l) : 0 === a.parents("label[for='" + this.escapeCssMeta(l) + "']").length && (o = a.attr("id"), u ? u.match(new RegExp("\\b" + this.escapeCssMeta(o) + "\\b")) || (u += " " + o) : u = o, t(e).attr("aria-describedby", u), s = this.groups[e.name], s && (r = this, t.each(r.groups, function (e, i) {
              i === s && t("[name='" + r.escapeCssMeta(e) + "']", r.currentForm).attr("aria-describedby", a.attr("id"))
            })))), !i && this.settings.success && (a.text(""), "string" == typeof this.settings.success ? a.addClass(this.settings.success) : this.settings.success(a, e)), this.toShow = this.toShow.add(a)
      }, errorsFor: function (e) {
        var i = this.escapeCssMeta(this.idOrName(e)), n = t(e).attr("aria-describedby"), s = "label[for='" + i + "'], label[for='" + i + "'] *";
        return n && (s = s + ", #" + this.escapeCssMeta(n).replace(/\s+/g, ", #")), this.errors().filter(s)
      }, escapeCssMeta: function (t) {
        return t.replace(/([\\!"#$%&'()*+,.\/:;<=>?@\[\]^`{|}~])/g, "\\$1")
      }, idOrName: function (t) {
        return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name)
      }, validationTargetFor: function (e) {
        return this.checkable(e) && (e = this.findByName(e.name)), t(e).not(this.settings.ignore)[0]
      }, checkable: function (t) {
        return /radio|checkbox/i.test(t.type)
      }, findByName: function (e) {
        return t(this.currentForm).find("[name='" + this.escapeCssMeta(e) + "']")
      }, getLength: function (e, i) {
        switch (i.nodeName.toLowerCase()) {
          case"select":
            return t("option:selected", i).length;
          case"input":
            if (this.checkable(i))return this.findByName(i.name).filter(":checked").length
        }
        return e.length
      }, depend: function (t, e) {
        return !this.dependTypes[typeof t] || this.dependTypes[typeof t](t, e)
      }, dependTypes: {
        "boolean": function (t) {
          return t
        }, string: function (e, i) {
          return !!t(e, i.form).length
        }, "function": function (t, e) {
          return t(e)
        }
      }, optional: function (e) {
        var i = this.elementValue(e);
        return !t.validator.methods.required.call(this, i, e) && "dependency-mismatch"
      }, startRequest: function (e) {
        this.pending[e.name] || (this.pendingRequest++, t(e).addClass(this.settings.pendingClass), this.pending[e.name] = !0)
      }, stopRequest: function (e, i) {
        this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[e.name], t(e).removeClass(this.settings.pendingClass), i && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(), this.formSubmitted = !1) : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
      }, previousValue: function (e, i) {
        return i = "string" == typeof i && i || "remote", t.data(e, "previousValue") || t.data(e, "previousValue", {
          old: null,
          valid: !0,
          message: this.defaultMessage(e, { method: i })
        })
      }, destroy: function () {
        this.resetForm(), t(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
      }
    },
    classRuleSettings: {
      required: { required: !0 },
      email: { email: !0 },
      url: { url: !0 },
      date: { date: !0 },
      dateISO: { dateISO: !0 },
      number: { number: !0 },
      digits: { digits: !0 },
      creditcard: { creditcard: !0 }
    },
    addClassRules: function (e, i) {
      e.constructor === String ? this.classRuleSettings[e] = i : t.extend(this.classRuleSettings, e)
    },
    classRules: function (e) {
      var i = {}, n = t(e).attr("class");
      return n && t.each(n.split(" "), function () {
        this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this])
      }), i
    },
    normalizeAttributeRule: function (t, e, i, n) {
      /min|max|step/.test(i) && (null === e || /number|range|text/.test(e)) && (n = Number(n), isNaN(n) && (n = void 0)), n || 0 === n ? t[i] = n : e === i && "range" !== e && (t[i] = !0)
    },
    attributeRules: function (e) {
      var i, n, s = {}, o = t(e), r = e.getAttribute("type");
      for (i in t.validator.methods)"required" === i ? (n = e.getAttribute(i), "" === n && (n = !0), n = !!n) : n = o.attr(i), this.normalizeAttributeRule(s, r, i, n);
      return s.maxlength && /-1|2147483647|524288/.test(s.maxlength) && delete s.maxlength, s
    },
    dataRules: function (e) {
      var i, n, s = {}, o = t(e), r = e.getAttribute("type");
      for (i in t.validator.methods)n = o.data("rule" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()), this.normalizeAttributeRule(s, r, i, n);
      return s
    },
    staticRules: function (e) {
      var i = {}, n = t.data(e.form, "validator");
      return n.settings.rules && (i = t.validator.normalizeRule(n.settings.rules[e.name]) || {}), i
    },
    normalizeRules: function (e, i) {
      return t.each(e, function (n, s) {
        if (s === !1)return void delete e[n];
        if (s.param || s.depends) {
          var o = !0;
          switch (typeof s.depends) {
            case"string":
              o = !!t(s.depends, i.form).length;
              break;
            case"function":
              o = s.depends.call(i, i)
          }
          o ? e[n] = void 0 === s.param || s.param : (t.data(i.form, "validator").resetElements(t(i)), delete e[n])
        }
      }), t.each(e, function (n, s) {
        e[n] = t.isFunction(s) && "normalizer" !== n ? s(i) : s
      }), t.each(["minlength", "maxlength"], function () {
        e[this] && (e[this] = Number(e[this]))
      }), t.each(["rangelength", "range"], function () {
        var i;
        e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (i = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/), e[this] = [Number(i[0]), Number(i[1])]))
      }), t.validator.autoCreateRanges && (null != e.min && null != e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), null != e.minlength && null != e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength)), e
    },
    normalizeRule: function (e) {
      if ("string" == typeof e) {
        var i = {};
        t.each(e.split(/\s/), function () {
          i[this] = !0
        }), e = i
      }
      return e
    },
    addMethod: function (e, i, n) {
      t.validator.methods[e] = i, t.validator.messages[e] = void 0 !== n ? n : t.validator.messages[e], i.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e))
    },
    methods: {
      required: function (e, i, n) {
        if (!this.depend(n, i))return "dependency-mismatch";
        if ("select" === i.nodeName.toLowerCase()) {
          var s = t(i).val();
          return s && s.length > 0
        }
        return this.checkable(i) ? this.getLength(e, i) > 0 : e.length > 0
      }, email: function (t, e) {
        return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t)
      }, url: function (t, e) {
        return this.optional(e) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(t)
      }, date: function (t, e) {
        return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
      }, dateISO: function (t, e) {
        return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)
      }, number: function (t, e) {
        return this.optional(e) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
      }, digits: function (t, e) {
        return this.optional(e) || /^\d+$/.test(t)
      }, minlength: function (e, i, n) {
        var s = t.isArray(e) ? e.length : this.getLength(e, i);
        return this.optional(i) || s >= n
      }, maxlength: function (e, i, n) {
        var s = t.isArray(e) ? e.length : this.getLength(e, i);
        return this.optional(i) || s <= n
      }, rangelength: function (e, i, n) {
        var s = t.isArray(e) ? e.length : this.getLength(e, i);
        return this.optional(i) || s >= n[0] && s <= n[1]
      }, min: function (t, e, i) {
        return this.optional(e) || t >= i
      }, max: function (t, e, i) {
        return this.optional(e) || t <= i
      }, range: function (t, e, i) {
        return this.optional(e) || t >= i[0] && t <= i[1]
      }, step: function (e, i, n) {
        var s, o = t(i).attr("type"), r = "Step attribute on input type " + o + " is not supported.", a = ["text", "number", "range"], l = new RegExp("\\b" + o + "\\b"), u = o && !l.test(a.join()), d = function (t) {
          var e = ("" + t).match(/(?:\.(\d+))?$/);
          return e && e[1] ? e[1].length : 0
        }, c = function (t) {
          return Math.round(t * Math.pow(10, s))
        }, h = !0;
        if (u)throw new Error(r);
        return s = d(n), (d(e) > s || c(e) % c(n) !== 0) && (h = !1), this.optional(i) || h
      }, equalTo: function (e, i, n) {
        var s = t(n);
        return this.settings.onfocusout && s.not(".validate-equalTo-blur").length && s.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
          t(i).valid()
        }), e === s.val()
      }, remote: function (e, i, n, s) {
        if (this.optional(i))return "dependency-mismatch";
        s = "string" == typeof s && s || "remote";
        var o, r, a, l = this.previousValue(i, s);
        return this.settings.messages[i.name] || (this.settings.messages[i.name] = {}), l.originalMessage = l.originalMessage || this.settings.messages[i.name][s], this.settings.messages[i.name][s] = l.message, n = "string" == typeof n && { url: n } || n, a = t.param(t.extend({ data: e }, n.data)), l.old === a ? l.valid : (l.old = a, o = this, this.startRequest(i), r = {}, r[i.name] = e, t.ajax(t.extend(!0, {
            mode: "abort",
            port: "validate" + i.name,
            dataType: "json",
            data: r,
            context: o.currentForm,
            success: function (t) {
              var n, r, a, u = t === !0 || "true" === t;
              o.settings.messages[i.name][s] = l.originalMessage, u ? (a = o.formSubmitted, o.resetInternals(), o.toHide = o.errorsFor(i), o.formSubmitted = a, o.successList.push(i), o.invalid[i.name] = !1, o.showErrors()) : (n = {}, r = t || o.defaultMessage(i, {
                    method: s,
                    parameters: e
                  }), n[i.name] = l.message = r, o.invalid[i.name] = !0, o.showErrors(n)), l.valid = u, o.stopRequest(i, u)
            }
          }, n)), "pending")
      }
    }
  });
  var e, i = {};
  return t.ajaxPrefilter ? t.ajaxPrefilter(function (t, e, n) {
      var s = t.port;
      "abort" === t.mode && (i[s] && i[s].abort(), i[s] = n)
    }) : (e = t.ajax, t.ajax = function (n) {
      var s = ("mode" in n ? n : t.ajaxSettings).mode, o = ("port" in n ? n : t.ajaxSettings).port;
      return "abort" === s ? (i[o] && i[o].abort(), i[o] = e.apply(this, arguments), i[o]) : e.apply(this, arguments)
    }), t
}), function (t) {
  "function" == typeof define && define.amd ? define(["jquery", "./jquery.validate"], t) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function (t) {
  return function () {
    function e(t) {
      return t.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "")
    }

    t.validator.addMethod("maxWords", function (t, i, n) {
      return this.optional(i) || e(t).match(/\b\w+\b/g).length <= n
    }, t.validator.format("Please enter {0} words or less.")), t.validator.addMethod("minWords", function (t, i, n) {
      return this.optional(i) || e(t).match(/\b\w+\b/g).length >= n
    }, t.validator.format("Please enter at least {0} words.")), t.validator.addMethod("rangeWords", function (t, i, n) {
      var s = e(t), o = /\b\w+\b/g;
      return this.optional(i) || s.match(o).length >= n[0] && s.match(o).length <= n[1]
    }, t.validator.format("Please enter between {0} and {1} words."))
  }(), t.validator.addMethod("accept", function (e, i, n) {
    var s, o, r, a = "string" == typeof n ? n.replace(/\s/g, "") : "image/*", l = this.optional(i);
    if (l)return l;
    if ("file" === t(i).attr("type") && (a = a.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&").replace(/,/g, "|").replace(/\/\*/g, "/.*"), i.files && i.files.length))for (r = new RegExp(".?(" + a + ")$", "i"), s = 0; s < i.files.length; s++)if (o = i.files[s], !o.type.match(r))return !1;
    return !0
  }, t.validator.format("Please enter a value with a valid mimetype.")), t.validator.addMethod("alphanumeric", function (t, e) {
    return this.optional(e) || /^\w+$/i.test(t)
  }, "Letters, numbers, and underscores only please"), t.validator.addMethod("bankaccountNL", function (t, e) {
    if (this.optional(e))return !0;
    if (!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(t))return !1;
    var i, n, s, o = t.replace(/ /g, ""), r = 0, a = o.length;
    for (i = 0; i < a; i++)n = a - i, s = o.substring(i, i + 1), r += n * s;
    return r % 11 === 0
  }, "Please specify a valid bank account number"), t.validator.addMethod("bankorgiroaccountNL", function (e, i) {
    return this.optional(i) || t.validator.methods.bankaccountNL.call(this, e, i) || t.validator.methods.giroaccountNL.call(this, e, i)
  }, "Please specify a valid bank or giro account number"), t.validator.addMethod("bic", function (t, e) {
    return this.optional(e) || /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(t.toUpperCase())
  }, "Please specify a valid BIC code"), t.validator.addMethod("cifES", function (t) {
    "use strict";
    function e(t) {
      return t % 2 === 0
    }

    var i, n, s, o, r = new RegExp(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/gi), a = t.substring(0, 1), l = t.substring(1, 8), u = t.substring(8, 9), d = 0, c = 0, h = 0;
    if (9 !== t.length || !r.test(t))return !1;
    for (i = 0; i < l.length; i++)n = parseInt(l[i], 10), e(i) ? (n *= 2, h += n < 10 ? n : n - 9) : c += n;
    return d = c + h, s = (10 - d.toString().substr(-1)).toString(), s = parseInt(s, 10) > 9 ? "0" : s, o = "JABCDEFGHI".substr(s, 1).toString(), a.match(/[ABEH]/) ? u === s : a.match(/[KPQS]/) ? u === o : u === s || u === o
  }, "Please specify a valid CIF number."), t.validator.addMethod("cpfBR", function (t) {
    if (t = t.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g, ""), 11 !== t.length)return !1;
    var e, i, n, s, o = 0;
    if (e = parseInt(t.substring(9, 10), 10), i = parseInt(t.substring(10, 11), 10), n = function (t, e) {
        var i = 10 * t % 11;
        return 10 !== i && 11 !== i || (i = 0), i === e
      }, "" === t || "00000000000" === t || "11111111111" === t || "22222222222" === t || "33333333333" === t || "44444444444" === t || "55555555555" === t || "66666666666" === t || "77777777777" === t || "88888888888" === t || "99999999999" === t)return !1;
    for (s = 1; s <= 9; s++)o += parseInt(t.substring(s - 1, s), 10) * (11 - s);
    if (n(o, e)) {
      for (o = 0, s = 1; s <= 10; s++)o += parseInt(t.substring(s - 1, s), 10) * (12 - s);
      return n(o, i)
    }
    return !1
  }, "Please specify a valid CPF number"), t.validator.addMethod("creditcard", function (t, e) {
    if (this.optional(e))return "dependency-mismatch";
    if (/[^0-9 \-]+/.test(t))return !1;
    var i, n, s = 0, o = 0, r = !1;
    if (t = t.replace(/\D/g, ""), t.length < 13 || t.length > 19)return !1;
    for (i = t.length - 1; i >= 0; i--)n = t.charAt(i), o = parseInt(n, 10), r && (o *= 2) > 9 && (o -= 9), s += o, r = !r;
    return s % 10 === 0
  }, "Please enter a valid credit card number."), t.validator.addMethod("creditcardtypes", function (t, e, i) {
    if (/[^0-9\-]+/.test(t))return !1;
    t = t.replace(/\D/g, "");
    var n = 0;
    return i.mastercard && (n |= 1), i.visa && (n |= 2), i.amex && (n |= 4), i.dinersclub && (n |= 8), i.enroute && (n |= 16), i.discover && (n |= 32), i.jcb && (n |= 64), i.unknown && (n |= 128), i.all && (n = 255), 1 & n && /^(5[12345])/.test(t) ? 16 === t.length : 2 & n && /^(4)/.test(t) ? 16 === t.length : 4 & n && /^(3[47])/.test(t) ? 15 === t.length : 8 & n && /^(3(0[012345]|[68]))/.test(t) ? 14 === t.length : 16 & n && /^(2(014|149))/.test(t) ? 15 === t.length : 32 & n && /^(6011)/.test(t) ? 16 === t.length : 64 & n && /^(3)/.test(t) ? 16 === t.length : 64 & n && /^(2131|1800)/.test(t) ? 15 === t.length : !!(128 & n)
  }, "Please enter a valid credit card number."), t.validator.addMethod("currency", function (t, e, i) {
    var n, s = "string" == typeof i, o = s ? i : i[0], r = !!s || i[1];
    return o = o.replace(/,/g, ""), o = r ? o + "]" : o + "]?", n = "^[" + o + "([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$", n = new RegExp(n), this.optional(e) || n.test(t)
  }, "Please specify a valid currency"), t.validator.addMethod("dateFA", function (t, e) {
    return this.optional(e) || /^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/.test(t)
  }, t.validator.messages.date), t.validator.addMethod("dateITA", function (t, e) {
    var i, n, s, o, r, a = !1, l = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return l.test(t) ? (i = t.split("/"), n = parseInt(i[0], 10), s = parseInt(i[1], 10), o = parseInt(i[2], 10), r = new Date(Date.UTC(o, s - 1, n, 12, 0, 0, 0)), a = r.getUTCFullYear() === o && r.getUTCMonth() === s - 1 && r.getUTCDate() === n) : a = !1, this.optional(e) || a
  }, t.validator.messages.date), t.validator.addMethod("dateNL", function (t, e) {
    return this.optional(e) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(t)
  }, t.validator.messages.date), t.validator.addMethod("extension", function (t, e, i) {
    return i = "string" == typeof i ? i.replace(/,/g, "|") : "png|jpe?g|gif", this.optional(e) || t.match(new RegExp("\\.(" + i + ")$", "i"))
  }, t.validator.format("Please enter a value with a valid extension.")), t.validator.addMethod("giroaccountNL", function (t, e) {
    return this.optional(e) || /^[0-9]{1,7}$/.test(t)
  }, "Please specify a valid giro account number"), t.validator.addMethod("iban", function (t, e) {
    if (this.optional(e))return !0;
    var i, n, s, o, r, a, l, u, d, c = t.replace(/ /g, "").toUpperCase(), h = "", f = !0, p = "", g = "", m = 5;
    if (c.length < m)return !1;
    if (i = c.substring(0, 2), a = {
        AL: "\\d{8}[\\dA-Z]{16}",
        AD: "\\d{8}[\\dA-Z]{12}",
        AT: "\\d{16}",
        AZ: "[\\dA-Z]{4}\\d{20}",
        BE: "\\d{12}",
        BH: "[A-Z]{4}[\\dA-Z]{14}",
        BA: "\\d{16}",
        BR: "\\d{23}[A-Z][\\dA-Z]",
        BG: "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
        CR: "\\d{17}",
        HR: "\\d{17}",
        CY: "\\d{8}[\\dA-Z]{16}",
        CZ: "\\d{20}",
        DK: "\\d{14}",
        DO: "[A-Z]{4}\\d{20}",
        EE: "\\d{16}",
        FO: "\\d{14}",
        FI: "\\d{14}",
        FR: "\\d{10}[\\dA-Z]{11}\\d{2}",
        GE: "[\\dA-Z]{2}\\d{16}",
        DE: "\\d{18}",
        GI: "[A-Z]{4}[\\dA-Z]{15}",
        GR: "\\d{7}[\\dA-Z]{16}",
        GL: "\\d{14}",
        GT: "[\\dA-Z]{4}[\\dA-Z]{20}",
        HU: "\\d{24}",
        IS: "\\d{22}",
        IE: "[\\dA-Z]{4}\\d{14}",
        IL: "\\d{19}",
        IT: "[A-Z]\\d{10}[\\dA-Z]{12}",
        KZ: "\\d{3}[\\dA-Z]{13}",
        KW: "[A-Z]{4}[\\dA-Z]{22}",
        LV: "[A-Z]{4}[\\dA-Z]{13}",
        LB: "\\d{4}[\\dA-Z]{20}",
        LI: "\\d{5}[\\dA-Z]{12}",
        LT: "\\d{16}",
        LU: "\\d{3}[\\dA-Z]{13}",
        MK: "\\d{3}[\\dA-Z]{10}\\d{2}",
        MT: "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
        MR: "\\d{23}",
        MU: "[A-Z]{4}\\d{19}[A-Z]{3}",
        MC: "\\d{10}[\\dA-Z]{11}\\d{2}",
        MD: "[\\dA-Z]{2}\\d{18}",
        ME: "\\d{18}",
        NL: "[A-Z]{4}\\d{10}",
        NO: "\\d{11}",
        PK: "[\\dA-Z]{4}\\d{16}",
        PS: "[\\dA-Z]{4}\\d{21}",
        PL: "\\d{24}",
        PT: "\\d{21}",
        RO: "[A-Z]{4}[\\dA-Z]{16}",
        SM: "[A-Z]\\d{10}[\\dA-Z]{12}",
        SA: "\\d{2}[\\dA-Z]{18}",
        RS: "\\d{18}",
        SK: "\\d{20}",
        SI: "\\d{15}",
        ES: "\\d{20}",
        SE: "\\d{20}",
        CH: "\\d{5}[\\dA-Z]{12}",
        TN: "\\d{20}",
        TR: "\\d{5}[\\dA-Z]{17}",
        AE: "\\d{3}\\d{16}",
        GB: "[A-Z]{4}\\d{14}",
        VG: "[\\dA-Z]{4}\\d{16}"
      }, r = a[i], "undefined" != typeof r && (l = new RegExp("^[A-Z]{2}\\d{2}" + r + "$", ""), !l.test(c)))return !1;
    for (n = c.substring(4, c.length) + c.substring(0, 4), u = 0; u < n.length; u++)s = n.charAt(u), "0" !== s && (f = !1), f || (h += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(s));
    for (d = 0; d < h.length; d++)o = h.charAt(d), g = "" + p + o, p = g % 97;
    return 1 === p
  }, "Please specify a valid IBAN"), t.validator.addMethod("integer", function (t, e) {
    return this.optional(e) || /^-?\d+$/.test(t)
  }, "A positive or negative non-decimal number please"), t.validator.addMethod("ipv4", function (t, e) {
    return this.optional(e) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(t)
  }, "Please enter a valid IP v4 address."), t.validator.addMethod("ipv6", function (t, e) {
    return this.optional(e) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(t)
  }, "Please enter a valid IP v6 address."), t.validator.addMethod("lettersonly", function (t, e) {
    return this.optional(e) || /^[a-z]+$/i.test(t)
  }, "Letters only please"), t.validator.addMethod("letterswithbasicpunc", function (t, e) {
    return this.optional(e) || /^[a-z\-.,()'"\s]+$/i.test(t)
  }, "Letters or punctuation only please"), t.validator.addMethod("mobileNL", function (t, e) {
    return this.optional(e) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(t)
  }, "Please specify a valid mobile number"), t.validator.addMethod("mobileUK", function (t, e) {
    return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[1345789]\d{2}|624)\s?\d{3}\s?\d{3})$/)
  }, "Please specify a valid mobile number"), t.validator.addMethod("nieES", function (t) {
    "use strict";
    var e, i = new RegExp(/^[MXYZ]{1}[0-9]{7,8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/gi), n = "TRWAGMYFPDXBNJZSQVHLCKET", s = t.substr(t.length - 1).toUpperCase();
    return t = t.toString().toUpperCase(), !(t.length > 10 || t.length < 9 || !i.test(t)) && (t = t.replace(/^[X]/, "0").replace(/^[Y]/, "1").replace(/^[Z]/, "2"), e = 9 === t.length ? t.substr(0, 8) : t.substr(0, 9), n.charAt(parseInt(e, 10) % 23) === s)
  }, "Please specify a valid NIE number."), t.validator.addMethod("nifES", function (t) {
    "use strict";
    return t = t.toUpperCase(), !!t.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)") && (/^[0-9]{8}[A-Z]{1}$/.test(t) ? "TRWAGMYFPDXBNJZSQVHLCKE".charAt(t.substring(8, 0) % 23) === t.charAt(8) : !!/^[KLM]{1}/.test(t) && t[8] === String.fromCharCode(64))
  }, "Please specify a valid NIF number."), t.validator.addMethod("notEqualTo", function (e, i, n) {
    return this.optional(i) || !t.validator.methods.equalTo.call(this, e, i, n)
  }, "Please enter a different value, values must not be the same."), t.validator.addMethod("nowhitespace", function (t, e) {
    return this.optional(e) || /^\S+$/i.test(t)
  }, "No white space please"), t.validator.addMethod("pattern", function (t, e, i) {
    return !!this.optional(e) || ("string" == typeof i && (i = new RegExp("^(?:" + i + ")$")), i.test(t))
  }, "Invalid format."), t.validator.addMethod("phoneNL", function (t, e) {
    return this.optional(e) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(t)
  }, "Please specify a valid phone number."), t.validator.addMethod("phonesUK", function (t, e) {
    return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/)
  }, "Please specify a valid uk phone number"), t.validator.addMethod("phoneUK", function (t, e) {
    return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/)
  }, "Please specify a valid phone number"), t.validator.addMethod("phoneUS", function (t, e) {
    return t = t.replace(/\s+/g, ""), this.optional(e) || t.length > 9 && t.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/)
  }, "Please specify a valid phone number"), t.validator.addMethod("postalcodeBR", function (t, e) {
    return this.optional(e) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test(t)
  }, "Informe um CEP válido."), t.validator.addMethod("postalCodeCA", function (t, e) {
    return this.optional(e) || /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] *\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(t)
  }, "Please specify a valid postal code"), t.validator.addMethod("postalcodeIT", function (t, e) {
    return this.optional(e) || /^\d{5}$/.test(t)
  }, "Please specify a valid postal code"), t.validator.addMethod("postalcodeNL", function (t, e) {
    return this.optional(e) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(t)
  }, "Please specify a valid postal code"), t.validator.addMethod("postcodeUK", function (t, e) {
    return this.optional(e) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(t)
  }, "Please specify a valid UK postcode"), t.validator.addMethod("require_from_group", function (e, i, n) {
    var s = t(n[1], i.form), o = s.eq(0), r = o.data("valid_req_grp") ? o.data("valid_req_grp") : t.extend({}, this), a = s.filter(function () {
        return r.elementValue(this)
      }).length >= n[0];
    return o.data("valid_req_grp", r), t(i).data("being_validated") || (s.data("being_validated", !0), s.each(function () {
      r.element(this)
    }), s.data("being_validated", !1)), a
  }, t.validator.format("Please fill at least {0} of these fields.")), t.validator.addMethod("skip_or_fill_minimum", function (e, i, n) {
    var s = t(n[1], i.form), o = s.eq(0), r = o.data("valid_skip") ? o.data("valid_skip") : t.extend({}, this), a = s.filter(function () {
      return r.elementValue(this)
    }).length, l = 0 === a || a >= n[0];
    return o.data("valid_skip", r), t(i).data("being_validated") || (s.data("being_validated", !0), s.each(function () {
      r.element(this)
    }), s.data("being_validated", !1)), l
  }, t.validator.format("Please either skip these fields or fill at least {0} of them.")), t.validator.addMethod("stateUS", function (t, e, i) {
    var n, s = "undefined" == typeof i, o = !s && "undefined" != typeof i.caseSensitive && i.caseSensitive, r = !s && "undefined" != typeof i.includeTerritories && i.includeTerritories, a = !s && "undefined" != typeof i.includeMilitary && i.includeMilitary;
    return n = r || a ? r && a ? "^(A[AEKLPRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$" : r ? "^(A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOPST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$" : "^(A[AEKLPRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$" : "^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])$", n = o ? new RegExp(n) : new RegExp(n, "i"), this.optional(e) || n.test(t)
  }, "Please specify a valid state"), t.validator.addMethod("strippedminlength", function (e, i, n) {
    return t(e).text().length >= n
  }, t.validator.format("Please enter at least {0} characters")), t.validator.addMethod("time", function (t, e) {
    return this.optional(e) || /^([01]\d|2[0-3]|[0-9])(:[0-5]\d){1,2}$/.test(t)
  }, "Please enter a valid time, between 00:00 and 23:59"), t.validator.addMethod("time12h", function (t, e) {
    return this.optional(e) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(t)
  }, "Please enter a valid time in 12-hour am/pm format"), t.validator.addMethod("url2", function (t, e) {
    return this.optional(e) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)
  }, t.validator.messages.url), t.validator.addMethod("vinUS", function (t) {
    if (17 !== t.length)return !1;
    var e, i, n, s, o, r, a = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], l = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9], u = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], d = 0;
    for (e = 0; e < 17; e++) {
      if (s = u[e], n = t.slice(e, e + 1), 8 === e && (r = n), isNaN(n)) {
        for (i = 0; i < a.length; i++)if (n.toUpperCase() === a[i]) {
          n = l[i], n *= s, isNaN(r) && 8 === i && (r = a[i]);
          break
        }
      } else n *= s;
      d += n
    }
    return o = d % 11, 10 === o && (o = "X"), o === r
  }, "The specified vehicle identification number (VIN) is invalid."), t.validator.addMethod("zipcodeUS", function (t, e) {
    return this.optional(e) || /^\d{5}(-\d{4})?$/.test(t)
  }, "The specified US ZIP Code is invalid"), t.validator.addMethod("ziprange", function (t, e) {
    return this.optional(e) || /^90[2-5]\d\{2\}-\d{4}$/.test(t)
  }, "Your ZIP-code must be in the range 902xx-xxxx to 905xx-xxxx"), t
}), function (t, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("whatInput", [], e) : "object" == typeof exports ? exports.whatInput = e() : t.whatInput = e()
}(this, function () {
  return function (t) {
    function e(n) {
      if (i[n])return i[n].exports;
      var s = i[n] = { exports: {}, id: n, loaded: !1 };
      return t[n].call(s.exports, s, s.exports, e), s.loaded = !0, s.exports
    }

    var i = {};
    return e.m = t, e.c = i, e.p = "", e(0)
  }([function (t, e) {
    t.exports = function () {
      var t = document.documentElement, e = "initial", i = null, n = ["input", "select", "textarea"], s = [16, 17, 18, 91, 93], o = {
        keyup: "keyboard",
        mousedown: "mouse",
        mousemove: "mouse",
        MSPointerDown: "pointer",
        MSPointerMove: "pointer",
        pointerdown: "pointer",
        pointermove: "pointer",
        touchstart: "touch"
      }, r = [], a = !1, l = { 2: "touch", 3: "touch", 4: "mouse" }, u = null, d = function () {
        o[v()] = "mouse", c(), f()
      }, c = function () {
        window.PointerEvent ? (t.addEventListener("pointerdown", h), t.addEventListener("pointermove", p)) : window.MSPointerEvent ? (t.addEventListener("MSPointerDown", h), t.addEventListener("MSPointerMove", p)) : (t.addEventListener("mousedown", h), t.addEventListener("mousemove", p), "ontouchstart" in window && t.addEventListener("touchstart", g)), t.addEventListener(v(), p), t.addEventListener("keydown", h), t.addEventListener("keyup", h)
      }, h = function (t) {
        if (!a) {
          var r = t.which, l = o[t.type];
          if ("pointer" === l && (l = m(t)), e !== l || i !== l) {
            var u = document.activeElement, d = !(!u || !u.nodeName || n.indexOf(u.nodeName.toLowerCase()) !== -1);
            ("touch" === l || "mouse" === l && s.indexOf(r) === -1 || "keyboard" === l && d) && (e = i = l, f())
          }
        }
      }, f = function () {
        t.setAttribute("data-whatinput", e), t.setAttribute("data-whatintent", e), r.indexOf(e) === -1 && (r.push(e), t.className += " whatinput-types-" + e)
      }, p = function (e) {
        if (!a) {
          var n = o[e.type];
          "pointer" === n && (n = m(e)), i !== n && (i = n, t.setAttribute("data-whatintent", i))
        }
      }, g = function (t) {
        window.clearTimeout(u), h(t), a = !0, u = window.setTimeout(function () {
          a = !1
        }, 200)
      }, m = function (t) {
        return "number" == typeof t.pointerType ? l[t.pointerType] : "pen" === t.pointerType ? "touch" : t.pointerType
      }, v = function () {
        return "onwheel" in document.createElement("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll"
      };
      return "addEventListener" in window && Array.prototype.indexOf && d(), {
        ask: function (t) {
          return "loose" === t ? i : e
        }, types: function () {
          return r
        }
      }
    }()
  }])
}), !function (t) {
  "use strict";
  function e(t) {
    if (void 0 === Function.prototype.name) {
      var e = /function\s([^(]{1,})\(/, i = e.exec(t.toString());
      return i && i.length > 1 ? i[1].trim() : ""
    }
    return void 0 === t.prototype ? t.constructor.name : t.prototype.constructor.name
  }

  function i(t) {
    return "true" === t || "false" !== t && (isNaN(1 * t) ? t : parseFloat(t))
  }

  function n(t) {
    return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  }

  var s = "6.3.0", o = {
    version: s, _plugins: {}, _uuids: [], rtl: function () {
      return "rtl" === t("html").attr("dir")
    }, plugin: function (t, i) {
      var s = i || e(t), o = n(s);
      this._plugins[o] = this[s] = t
    }, registerPlugin: function (t, i) {
      var s = i ? n(i) : e(t.constructor).toLowerCase();
      t.uuid = this.GetYoDigits(6, s), t.$element.attr("data-" + s) || t.$element.attr("data-" + s, t.uuid), t.$element.data("zfPlugin") || t.$element.data("zfPlugin", t), t.$element.trigger("init.zf." + s), this._uuids.push(t.uuid)
    }, unregisterPlugin: function (t) {
      var i = n(e(t.$element.data("zfPlugin").constructor));
      this._uuids.splice(this._uuids.indexOf(t.uuid), 1), t.$element.removeAttr("data-" + i).removeData("zfPlugin").trigger("destroyed.zf." + i);
      for (var s in t)t[s] = null
    }, reInit: function (e) {
      var i = e instanceof t;
      try {
        if (i) e.each(function () {
          t(this).data("zfPlugin")._init()
        }); else {
          var s = typeof e, o = this, r = {
            object: function (e) {
              e.forEach(function (e) {
                e = n(e), t("[data-" + e + "]").foundation("_init")
              })
            }, string: function () {
              e = n(e), t("[data-" + e + "]").foundation("_init")
            }, undefined: function () {
              this.object(Object.keys(o._plugins))
            }
          };
          r[s](e)
        }
      } catch (a) {
        console.error(a)
      } finally {
        return e
      }
    }, GetYoDigits: function (t, e) {
      return t = t || 6, Math.round(Math.pow(36, t + 1) - Math.random() * Math.pow(36, t)).toString(36).slice(1) + (e ? "-" + e : "")
    }, reflow: function (e, n) {
      "undefined" == typeof n ? n = Object.keys(this._plugins) : "string" == typeof n && (n = [n]);
      var s = this;
      t.each(n, function (n, o) {
        var r = s._plugins[o], a = t(e).find("[data-" + o + "]").addBack("[data-" + o + "]");
        a.each(function () {
          var e = t(this), n = {};
          if (e.data("zfPlugin"))return void console.warn("Tried to initialize " + o + " on an element that already has a Foundation plugin.");
          if (e.attr("data-options")) {
            e.attr("data-options").split(";").forEach(function (t, e) {
              var s = t.split(":").map(function (t) {
                return t.trim()
              });
              s[0] && (n[s[0]] = i(s[1]))
            })
          }
          try {
            e.data("zfPlugin", new r(t(this), n))
          } catch (s) {
            console.error(s)
          } finally {
            return
          }
        })
      })
    }, getFnName: e, transitionend: function (t) {
      var e, i = {
        transition: "transitionend",
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "otransitionend"
      }, n = document.createElement("div");
      for (var s in i)"undefined" != typeof n.style[s] && (e = i[s]);
      return e ? e : (e = setTimeout(function () {
          t.triggerHandler("transitionend", [t])
        }, 1), "transitionend")
    }
  };
  o.util = {
    throttle: function (t, e) {
      var i = null;
      return function () {
        var n = this, s = arguments;
        null === i && (i = setTimeout(function () {
          t.apply(n, s), i = null
        }, e))
      }
    }
  };
  var r = function (i) {
    var n = typeof i, s = t("meta.foundation-mq"), r = t(".no-js");
    if (s.length || t('<meta class="foundation-mq">').appendTo(document.head), r.length && r.removeClass("no-js"), "undefined" === n) o.MediaQuery._init(), o.reflow(this); else {
      if ("string" !== n)throw new TypeError("We're sorry, " + n + " is not a valid parameter. You must use a string representing the method you wish to invoke.");
      var a = Array.prototype.slice.call(arguments, 1), l = this.data("zfPlugin");
      if (void 0 === l || void 0 === l[i])throw new ReferenceError("We're sorry, '" + i + "' is not an available method for " + (l ? e(l) : "this element") + ".");
      1 === this.length ? l[i].apply(l, a) : this.each(function (e, n) {
          l[i].apply(t(n).data("zfPlugin"), a)
        })
    }
    return this
  };
  window.Foundation = o, t.fn.foundation = r, function () {
    Date.now && window.Date.now || (window.Date.now = Date.now = function () {
      return (new Date).getTime()
    });
    for (var t = ["webkit", "moz"], e = 0; e < t.length && !window.requestAnimationFrame; ++e) {
      var i = t[e];
      window.requestAnimationFrame = window[i + "RequestAnimationFrame"], window.cancelAnimationFrame = window[i + "CancelAnimationFrame"] || window[i + "CancelRequestAnimationFrame"]
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      var n = 0;
      window.requestAnimationFrame = function (t) {
        var e = Date.now(), i = Math.max(n + 16, e);
        return setTimeout(function () {
          t(n = i)
        }, i - e)
      }, window.cancelAnimationFrame = clearTimeout
    }
    window.performance && window.performance.now || (window.performance = {
      start: Date.now(), now: function () {
        return Date.now() - this.start
      }
    })
  }(), Function.prototype.bind || (Function.prototype.bind = function (t) {
    if ("function" != typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var e = Array.prototype.slice.call(arguments, 1), i = this, n = function () {
    }, s = function () {
      return i.apply(this instanceof n ? this : t, e.concat(Array.prototype.slice.call(arguments)))
    };
    return this.prototype && (n.prototype = this.prototype), s.prototype = new n, s
  })
}(jQuery), !function (t) {
  function e(t, e, n, s) {
    var o, r, a, l, u = i(t);
    if (e) {
      var d = i(e);
      r = u.offset.top + u.height <= d.height + d.offset.top, o = u.offset.top >= d.offset.top, a = u.offset.left >= d.offset.left, l = u.offset.left + u.width <= d.width + d.offset.left
    } else r = u.offset.top + u.height <= u.windowDims.height + u.windowDims.offset.top, o = u.offset.top >= u.windowDims.offset.top, a = u.offset.left >= u.windowDims.offset.left, l = u.offset.left + u.width <= u.windowDims.width;
    var c = [r, o, a, l];
    return n ? a === l == !0 : s ? o === r == !0 : c.indexOf(!1) === -1
  }

  function i(t, e) {
    if (t = t.length ? t[0] : t, t === window || t === document)throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
    var i = t.getBoundingClientRect(), n = t.parentNode.getBoundingClientRect(), s = document.body.getBoundingClientRect(), o = window.pageYOffset, r = window.pageXOffset;
    return {
      width: i.width,
      height: i.height,
      offset: { top: i.top + o, left: i.left + r },
      parentDims: { width: n.width, height: n.height, offset: { top: n.top + o, left: n.left + r } },
      windowDims: { width: s.width, height: s.height, offset: { top: o, left: r } }
    }
  }

  function n(t, e, n, s, o, r) {
    var a = i(t), l = e ? i(e) : null;
    switch (n) {
      case"top":
        return {
          left: Foundation.rtl() ? l.offset.left - a.width + l.width : l.offset.left,
          top: l.offset.top - (a.height + s)
        };
      case"left":
        return { left: l.offset.left - (a.width + o), top: l.offset.top };
      case"right":
        return { left: l.offset.left + l.width + o, top: l.offset.top };
      case"center top":
        return { left: l.offset.left + l.width / 2 - a.width / 2, top: l.offset.top - (a.height + s) };
      case"center bottom":
        return { left: r ? o : l.offset.left + l.width / 2 - a.width / 2, top: l.offset.top + l.height + s };
      case"center left":
        return { left: l.offset.left - (a.width + o), top: l.offset.top + l.height / 2 - a.height / 2 };
      case"center right":
        return { left: l.offset.left + l.width + o + 1, top: l.offset.top + l.height / 2 - a.height / 2 };
      case"center":
        return {
          left: a.windowDims.offset.left + a.windowDims.width / 2 - a.width / 2,
          top: a.windowDims.offset.top + a.windowDims.height / 2 - a.height / 2
        };
      case"reveal":
        return { left: (a.windowDims.width - a.width) / 2, top: a.windowDims.offset.top + s };
      case"reveal full":
        return { left: a.windowDims.offset.left, top: a.windowDims.offset.top };
      case"left bottom":
        return { left: l.offset.left, top: l.offset.top + l.height + s };
      case"right bottom":
        return { left: l.offset.left + l.width + o - a.width, top: l.offset.top + l.height + s };
      default:
        return {
          left: Foundation.rtl() ? l.offset.left - a.width + l.width : l.offset.left + o,
          top: l.offset.top + l.height + s
        }
    }
  }

  Foundation.Box = { ImNotTouchingYou: e, GetDimensions: i, GetOffsets: n }
}(jQuery), !function (t) {
  function e(t) {
    var e = {};
    for (var i in t)e[t[i]] = t[i];
    return e
  }

  var i = {
    9: "TAB",
    13: "ENTER",
    27: "ESCAPE",
    32: "SPACE",
    37: "ARROW_LEFT",
    38: "ARROW_UP",
    39: "ARROW_RIGHT",
    40: "ARROW_DOWN"
  }, n = {}, s = {
    keys: e(i), parseKey: function (t) {
      var e = i[t.which || t.keyCode] || String.fromCharCode(t.which).toUpperCase();
      return e = e.replace(/\W+/, ""), t.shiftKey && (e = "SHIFT_" + e), t.ctrlKey && (e = "CTRL_" + e), t.altKey && (e = "ALT_" + e), e = e.replace(/_$/, "")
    }, handleKey: function (e, i, s) {
      var o, r, a, l = n[i], u = this.parseKey(e);
      if (!l)return console.warn("Component not defined!");
      if (o = "undefined" == typeof l.ltr ? l : Foundation.rtl() ? t.extend({}, l.ltr, l.rtl) : t.extend({}, l.rtl, l.ltr), r = o[u], a = s[r], a && "function" == typeof a) {
        var d = a.apply();
        (s.handled || "function" == typeof s.handled) && s.handled(d)
      } else(s.unhandled || "function" == typeof s.unhandled) && s.unhandled()
    }, findFocusable: function (e) {
      return !!e && e.find("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]").filter(function () {
          return !(!t(this).is(":visible") || t(this).attr("tabindex") < 0)
        })
    }, register: function (t, e) {
      n[t] = e
    }, trapFocus: function (t) {
      var e = Foundation.Keyboard.findFocusable(t), i = e.eq(0), n = e.eq(-1);
      t.on("keydown.zf.trapfocus", function (t) {
        t.target === n[0] && "TAB" === Foundation.Keyboard.parseKey(t) ? (t.preventDefault(), i.focus()) : t.target === i[0] && "SHIFT_TAB" === Foundation.Keyboard.parseKey(t) && (t.preventDefault(), n.focus())
      })
    }, releaseFocus: function (t) {
      t.off("keydown.zf.trapfocus")
    }
  };
  Foundation.Keyboard = s
}(jQuery), !function (t) {
  function e(t) {
    var e = {};
    return "string" != typeof t ? e : (t = t.trim().slice(1, -1)) ? e = t.split("&").reduce(function (t, e) {
          var i = e.replace(/\+/g, " ").split("="), n = i[0], s = i[1];
          return n = decodeURIComponent(n), s = void 0 === s ? null : decodeURIComponent(s), t.hasOwnProperty(n) ? Array.isArray(t[n]) ? t[n].push(s) : t[n] = [t[n], s] : t[n] = s, t
        }, {}) : e
  }

  var i = {
    queries: [], current: "", _init: function () {
      var i, n = this, s = t(".foundation-mq").css("font-family");
      i = e(s);
      for (var o in i)i.hasOwnProperty(o) && n.queries.push({
        name: o,
        value: "only screen and (min-width: " + i[o] + ")"
      });
      this.current = this._getCurrentSize(), this._watcher()
    }, atLeast: function (t) {
      var e = this.get(t);
      return !!e && window.matchMedia(e).matches
    }, is: function (t) {
      return t = t.trim().split(" "), t.length > 1 && "only" === t[1] ? t[0] === this._getCurrentSize() : this.atLeast(t[0])
    }, get: function (t) {
      for (var e in this.queries)if (this.queries.hasOwnProperty(e)) {
        var i = this.queries[e];
        if (t === i.name)return i.value
      }
      return null
    }, _getCurrentSize: function () {
      for (var t, e = 0; e < this.queries.length; e++) {
        var i = this.queries[e];
        window.matchMedia(i.value).matches && (t = i)
      }
      return "object" == typeof t ? t.name : t
    }, _watcher: function () {
      var e = this;
      t(window).on("resize.zf.mediaquery", function () {
        var i = e._getCurrentSize(), n = e.current;
        i !== n && (e.current = i, t(window).trigger("changed.zf.mediaquery", [i, n]))
      })
    }
  };
  Foundation.MediaQuery = i, window.matchMedia || (window.matchMedia = function () {
    "use strict";
    var t = window.styleMedia || window.media;
    if (!t) {
      var e = document.createElement("style"), i = document.getElementsByTagName("script")[0], n = null;
      e.type = "text/css", e.id = "matchmediajs-test", i && i.parentNode && i.parentNode.insertBefore(e, i), n = "getComputedStyle" in window && window.getComputedStyle(e, null) || e.currentStyle, t = {
        matchMedium: function (t) {
          var i = "@media " + t + "{ #matchmediajs-test { width: 1px; } }";
          return e.styleSheet ? e.styleSheet.cssText = i : e.textContent = i, "1px" === n.width
        }
      }
    }
    return function (e) {
      return { matches: t.matchMedium(e || "all"), media: e || "all" }
    }
  }()), Foundation.MediaQuery = i
}(jQuery), !function (t) {
  function e(t, e, i) {
    function n(a) {
      r || (r = a), o = a - r, i.apply(e), o < t ? s = window.requestAnimationFrame(n, e) : (window.cancelAnimationFrame(s), e.trigger("finished.zf.animate", [e]).triggerHandler("finished.zf.animate", [e]))
    }

    var s, o, r = null;
    return 0 === t ? (i.apply(e), void e.trigger("finished.zf.animate", [e]).triggerHandler("finished.zf.animate", [e])) : void(s = window.requestAnimationFrame(n))
  }

  function i(e, i, o, r) {
    function a() {
      e || i.hide(), l(), r && r.apply(i)
    }

    function l() {
      i[0].style.transitionDuration = 0, i.removeClass(u + " " + d + " " + o)
    }

    if (i = t(i).eq(0), i.length) {
      var u = e ? n[0] : n[1], d = e ? s[0] : s[1];
      l(), i.addClass(o).css("transition", "none"), requestAnimationFrame(function () {
        i.addClass(u), e && i.show()
      }), requestAnimationFrame(function () {
        i[0].offsetWidth, i.css("transition", "").addClass(d)
      }), i.one(Foundation.transitionend(i), a)
    }
  }

  var n = ["mui-enter", "mui-leave"], s = ["mui-enter-active", "mui-leave-active"], o = {
    animateIn: function (t, e, n) {
      i(!0, t, e, n)
    }, animateOut: function (t, e, n) {
      i(!1, t, e, n)
    }
  };
  Foundation.Move = e, Foundation.Motion = o
}(jQuery), !function (t) {
  var e = {
    Feather: function (e) {
      var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "zf";
      e.attr("role", "menubar");
      var n = e.find("li").attr({ role: "menuitem" }), s = "is-" + i + "-submenu", o = s + "-item", r = "is-" + i + "-submenu-parent";
      n.each(function () {
        var e = t(this), n = e.children("ul");
        n.length && (e.addClass(r).attr({
          "aria-haspopup": !0,
          "aria-label": e.children("a:first").text()
        }), "drilldown" === i && e.attr({ "aria-expanded": !1 }), n.addClass("submenu " + s).attr({
          "data-submenu": "",
          role: "menu"
        }), "drilldown" === i && n.attr({ "aria-hidden": !0 })), e.parent("[data-submenu]").length && e.addClass("is-submenu-item " + o)
      })
    }, Burn: function (t, e) {
      var i = "is-" + e + "-submenu", n = i + "-item", s = "is-" + e + "-submenu-parent";
      t.find(">li, .menu, .menu > li").removeClass(i + " " + n + " " + s + " is-submenu-item submenu is-active").removeAttr("data-submenu").css("display", "")
    }
  };
  Foundation.Nest = e
}(jQuery), !function (t) {
  function e(t, e, i) {
    var n, s, o = this, r = e.duration, a = Object.keys(t.data())[0] || "timer", l = -1;
    this.isPaused = !1, this.restart = function () {
      l = -1, clearTimeout(s), this.start()
    }, this.start = function () {
      this.isPaused = !1, clearTimeout(s), l = l <= 0 ? r : l, t.data("paused", !1), n = Date.now(), s = setTimeout(function () {
        e.infinite && o.restart(), i && "function" == typeof i && i()
      }, l), t.trigger("timerstart.zf." + a)
    }, this.pause = function () {
      this.isPaused = !0, clearTimeout(s), t.data("paused", !0);
      var e = Date.now();
      l -= e - n, t.trigger("timerpaused.zf." + a)
    }
  }

  function i(e, i) {
    function n() {
      s--, 0 === s && i()
    }

    var s = e.length;
    0 === s && i(), e.each(function () {
      if (this.complete || 4 === this.readyState || "complete" === this.readyState) n(); else {
        var e = t(this).attr("src");
        t(this).attr("src", e + "?" + (new Date).getTime()), t(this).one("load", function () {
          n()
        })
      }
    })
  }

  Foundation.Timer = e, Foundation.onImagesLoaded = i
}(jQuery), function (t) {
  function e() {
    this.removeEventListener("touchmove", i), this.removeEventListener("touchend", e), u = !1
  }

  function i(i) {
    if (t.spotSwipe.preventDefault && i.preventDefault(), u) {
      var n, s = i.touches[0].pageX, r = (i.touches[0].pageY, o - s);
      l = (new Date).getTime() - a, Math.abs(r) >= t.spotSwipe.moveThreshold && l <= t.spotSwipe.timeThreshold && (n = r > 0 ? "left" : "right"), n && (i.preventDefault(), e.call(this), t(this).trigger("swipe", n).trigger("swipe" + n))
    }
  }

  function n(t) {
    1 == t.touches.length && (o = t.touches[0].pageX, r = t.touches[0].pageY, u = !0, a = (new Date).getTime(), this.addEventListener("touchmove", i, !1), this.addEventListener("touchend", e, !1))
  }

  function s() {
    this.addEventListener && this.addEventListener("touchstart", n, !1)
  }

  t.spotSwipe = {
    version: "1.0.0",
    enabled: "ontouchstart" in document.documentElement,
    preventDefault: !1,
    moveThreshold: 75,
    timeThreshold: 200
  };
  var o, r, a, l, u = !1;
  t.event.special.swipe = { setup: s }, t.each(["left", "up", "down", "right"], function () {
    t.event.special["swipe" + this] = {
      setup: function () {
        t(this).on("swipe", t.noop)
      }
    }
  })
}(jQuery), !function (t) {
  t.fn.addTouch = function () {
    this.each(function (i, n) {
      t(n).bind("touchstart touchmove touchend touchcancel", function () {
        e(event)
      })
    });
    var e = function (t) {
      var e, i = t.changedTouches, n = i[0], s = {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
      }, o = s[t.type];
      "MouseEvent" in window && "function" == typeof window.MouseEvent ? e = new window.MouseEvent(o, {
          bubbles: !0,
          cancelable: !0,
          screenX: n.screenX,
          screenY: n.screenY,
          clientX: n.clientX,
          clientY: n.clientY
        }) : (e = document.createEvent("MouseEvent"), e.initMouseEvent(o, !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null)), n.target.dispatchEvent(e)
    }
  }
}(jQuery), !function (t) {
  function e() {
    r(), n(), s(), o(), i()
  }

  function i(e) {
    var i = t("[data-yeti-box]"), n = ["dropdown", "tooltip", "reveal"];
    if (e && ("string" == typeof e ? n.push(e) : "object" == typeof e && "string" == typeof e[0] ? n.concat(e) : console.error("Plugin names must be strings")), i.length) {
      var s = n.map(function (t) {
        return "closeme.zf." + t
      }).join(" ");
      t(window).off(s).on(s, function (e, i) {
        var n = e.namespace.split(".")[0], s = t("[data-" + n + "]").not('[data-yeti-box="' + i + '"]');
        s.each(function () {
          var e = t(this);
          e.triggerHandler("close.zf.trigger", [e])
        })
      })
    }
  }

  function n(e) {
    var i = void 0, n = t("[data-resize]");
    n.length && t(window).off("resize.zf.trigger").on("resize.zf.trigger", function (s) {
      i && clearTimeout(i), i = setTimeout(function () {
        a || n.each(function () {
          t(this).triggerHandler("resizeme.zf.trigger")
        }), n.attr("data-events", "resize")
      }, e || 10)
    })
  }

  function s(e) {
    var i = void 0, n = t("[data-scroll]");
    n.length && t(window).off("scroll.zf.trigger").on("scroll.zf.trigger", function (s) {
      i && clearTimeout(i), i = setTimeout(function () {
        a || n.each(function () {
          t(this).triggerHandler("scrollme.zf.trigger")
        }), n.attr("data-events", "scroll")
      }, e || 10)
    })
  }

  function o(e) {
    var i = t("[data-mutate]");
    i.length && a && i.each(function () {
      t(this).triggerHandler("mutateme.zf.trigger")
    })
  }

  function r() {
    if (!a)return !1;
    var e = document.querySelectorAll("[data-resize], [data-scroll], [data-mutate]"), i = function (e) {
      var i = t(e[0].target);
      switch (e[0].type) {
        case"attributes":
          "scroll" === i.attr("data-events") && "data-events" === e[0].attributeName && i.triggerHandler("scrollme.zf.trigger", [i, window.pageYOffset]), "resize" === i.attr("data-events") && "data-events" === e[0].attributeName && i.triggerHandler("resizeme.zf.trigger", [i]), "style" === e[0].attributeName && (i.closest("[data-mutate]").attr("data-events", "mutate"), i.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [i.closest("[data-mutate]")]));
          break;
        case"childList":
          i.closest("[data-mutate]").attr("data-events", "mutate"), i.closest("[data-mutate]").triggerHandler("mutateme.zf.trigger", [i.closest("[data-mutate]")]);
          break;
        default:
          return !1
      }
    };
    if (e.length)for (var n = 0; n <= e.length - 1; n++) {
      var s = new a(i);
      s.observe(e[n], {
        attributes: !0,
        childList: !0,
        characterData: !1,
        subtree: !0,
        attributeFilter: ["data-events", "style"]
      })
    }
  }

  var a = function () {
    for (var t = ["WebKit", "Moz", "O", "Ms", ""], e = 0; e < t.length; e++)if (t[e] + "MutationObserver" in window)return window[t[e] + "MutationObserver"];
    return !1
  }(), l = function (e, i) {
    e.data(i).split(" ").forEach(function (n) {
      t("#" + n)["close" === i ? "trigger" : "triggerHandler"](i + ".zf.trigger", [e])
    })
  };
  t(document).on("click.zf.trigger", "[data-open]", function () {
    l(t(this), "open")
  }), t(document).on("click.zf.trigger", "[data-close]", function () {
    var e = t(this).data("close");
    e ? l(t(this), "close") : t(this).trigger("close.zf.trigger")
  }), t(document).on("click.zf.trigger", "[data-toggle]", function () {
    var e = t(this).data("toggle");
    e ? l(t(this), "toggle") : t(this).trigger("toggle.zf.trigger")
  }), t(document).on("close.zf.trigger", "[data-closable]", function (e) {
    e.stopPropagation();
    var i = t(this).data("closable");
    "" !== i ? Foundation.Motion.animateOut(t(this), i, function () {
        t(this).trigger("closed.zf")
      }) : t(this).fadeOut().trigger("closed.zf")
  }), t(document).on("focus.zf.trigger blur.zf.trigger", "[data-toggle-focus]", function () {
    var e = t(this).data("toggle-focus");
    t("#" + e).triggerHandler("toggle.zf.trigger", [t(this)])
  }), t(window).on("load", function () {
    e()
  }), Foundation.IHearYou = e
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Abide")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this.$inputs = this.$element.find("input, textarea, select"), this._events()
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        this.$element.off(".abide").on("reset.zf.abide", function () {
          e.resetForm()
        }).on("submit.zf.abide", function () {
          return e.validateForm()
        }), "fieldChange" === this.options.validateOn && this.$inputs.off("change.zf.abide").on("change.zf.abide", function (i) {
          e.validateInput(t(i.target))
        }), this.options.liveValidate && this.$inputs.off("input.zf.abide").on("input.zf.abide", function (i) {
          e.validateInput(t(i.target))
        }), this.options.validateOnBlur && this.$inputs.off("blur.zf.abide").on("blur.zf.abide", function (i) {
          e.validateInput(t(i.target))
        })
      }
    }, {
      key: "_reflow", value: function () {
        this._init()
      }
    }, {
      key: "requiredCheck", value: function (t) {
        if (!t.attr("required"))return !0;
        var e = !0;
        switch (t[0].type) {
          case"checkbox":
            e = t[0].checked;
            break;
          case"select":
          case"select-one":
          case"select-multiple":
            var i = t.find("option:selected");
            i.length && i.val() || (e = !1);
            break;
          default:
            t.val() && t.val().length || (e = !1)
        }
        return e
      }
    }, {
      key: "findFormError", value: function (t) {
        var e = t.siblings(this.options.formErrorSelector);
        return e.length || (e = t.parent().find(this.options.formErrorSelector)), e
      }
    }, {
      key: "findLabel", value: function (t) {
        var e = t[0].id, i = this.$element.find('label[for="' + e + '"]');
        return i.length ? i : t.closest("label")
      }
    }, {
      key: "findRadioLabels", value: function (e) {
        var i = this, n = e.map(function (e, n) {
          var s = n.id, o = i.$element.find('label[for="' + s + '"]');
          return o.length || (o = t(n).closest("label")), o[0]
        });
        return t(n)
      }
    }, {
      key: "addErrorClasses", value: function (t) {
        var e = this.findLabel(t), i = this.findFormError(t);
        e.length && e.addClass(this.options.labelErrorClass), i.length && i.addClass(this.options.formErrorClass), t.addClass(this.options.inputErrorClass).attr("data-invalid", "")
      }
    }, {
      key: "removeRadioErrorClasses", value: function (t) {
        var e = this.$element.find(':radio[name="' + t + '"]'), i = this.findRadioLabels(e), n = this.findFormError(e);
        i.length && i.removeClass(this.options.labelErrorClass), n.length && n.removeClass(this.options.formErrorClass), e.removeClass(this.options.inputErrorClass).removeAttr("data-invalid")
      }
    }, {
      key: "removeErrorClasses", value: function (t) {
        if ("radio" == t[0].type)return this.removeRadioErrorClasses(t.attr("name"));
        var e = this.findLabel(t), i = this.findFormError(t);
        e.length && e.removeClass(this.options.labelErrorClass), i.length && i.removeClass(this.options.formErrorClass), t.removeClass(this.options.inputErrorClass).removeAttr("data-invalid")
      }
    }, {
      key: "validateInput", value: function (e) {
        var i = this, n = this.requiredCheck(e), s = !1, o = !0, r = e.attr("data-validator"), a = !0;
        if (e.is("[data-abide-ignore]") || e.is('[type="hidden"]'))return !0;
        switch (e[0].type) {
          case"radio":
            s = this.validateRadio(e.attr("name"));
            break;
          case"checkbox":
            s = n;
            break;
          case"select":
          case"select-one":
          case"select-multiple":
            s = n;
            break;
          default:
            s = this.validateText(e)
        }
        r && (o = this.matchValidation(e, r, e.attr("required"))), e.attr("data-equalto") && (a = this.options.validators.equalTo(e));
        var l = [n, s, o, a].indexOf(!1) === -1, u = (l ? "valid" : "invalid") + ".zf.abide";
        if (l) {
          var d = this.$element.find('[data-equalto="' + e.attr("id") + '"]');
          d.length && !function () {
            var e = i;
            d.each(function () {
              t(this).val() && e.validateInput(t(this))
            })
          }()
        }
        return this[l ? "removeErrorClasses" : "addErrorClasses"](e), e.trigger(u, [e]), l
      }
    }, {
      key: "validateForm", value: function () {
        var e = [], i = this;
        this.$inputs.each(function () {
          e.push(i.validateInput(t(this)))
        });
        var n = e.indexOf(!1) === -1;
        return this.$element.find("[data-abide-error]").css("display", n ? "none" : "block"), this.$element.trigger((n ? "formvalid" : "forminvalid") + ".zf.abide", [this.$element]), n
      }
    }, {
      key: "validateText", value: function (t, e) {
        e = e || t.attr("pattern") || t.attr("type");
        var i = t.val(), n = !1;
        return i.length ? n = this.options.patterns.hasOwnProperty(e) ? this.options.patterns[e].test(i) : e === t.attr("type") || new RegExp(e).test(i) : t.prop("required") || (n = !0), n
      }
    }, {
      key: "validateRadio", value: function (e) {
        var i = this.$element.find(':radio[name="' + e + '"]'), n = !1, s = !1;
        return i.each(function (e, i) {
          t(i).attr("required") && (s = !0)
        }), s || (n = !0), n || i.each(function (e, i) {
          t(i).prop("checked") && (n = !0)
        }), n
      }
    }, {
      key: "matchValidation", value: function (t, e, i) {
        var n = this;
        i = !!i;
        var s = e.split(" ").map(function (e) {
          return n.options.validators[e](t, i, t.parent())
        });
        return s.indexOf(!1) === -1
      }
    }, {
      key: "resetForm", value: function () {
        var e = this.$element, i = this.options;
        t("." + i.labelErrorClass, e).not("small").removeClass(i.labelErrorClass), t("." + i.inputErrorClass, e).not("small").removeClass(i.inputErrorClass), t(i.formErrorSelector + "." + i.formErrorClass).removeClass(i.formErrorClass), e.find("[data-abide-error]").css("display", "none"), t(":input", e).not(":button, :submit, :reset, :hidden, :radio, :checkbox, [data-abide-ignore]").val("").removeAttr("data-invalid"), t(":input:radio", e).not("[data-abide-ignore]").prop("checked", !1).removeAttr("data-invalid"), t(":input:checkbox", e).not("[data-abide-ignore]").prop("checked", !1).removeAttr("data-invalid"), e.trigger("formreset.zf.abide", [e])
      }
    }, {
      key: "destroy", value: function () {
        var e = this;
        this.$element.off(".abide").find("[data-abide-error]").css("display", "none"), this.$inputs.off(".abide").each(function () {
          e.removeErrorClasses(t(this))
        }), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    validateOn: "fieldChange",
    labelErrorClass: "is-invalid-label",
    inputErrorClass: "is-invalid-input",
    formErrorSelector: ".form-error",
    formErrorClass: "is-visible",
    liveValidate: !1,
    validateOnBlur: !1,
    patterns: {
      alpha: /^[a-zA-Z]+$/,
      alpha_numeric: /^[a-zA-Z0-9]+$/,
      integer: /^[-+]?\d+$/,
      number: /^[-+]?\d*(?:[\.\,]\d+)?$/,
      card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
      cvv: /^([0-9]){3,4}$/,
      email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
      url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
      domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,
      datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
      date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
      time: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
      dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
      month_day_year: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
      day_month_year: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,
      color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
    },
    validators: {
      equalTo: function (e, i, n) {
        return t("#" + e.attr("data-equalto")).val() === e.val()
      }
    }
  }, Foundation.plugin(e, "Abide")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Accordion"), Foundation.Keyboard.register("Accordion", {
        ENTER: "toggle",
        SPACE: "toggle",
        ARROW_DOWN: "next",
        ARROW_UP: "previous"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this.$element.attr("role", "tablist"), this.$tabs = this.$element.children("[data-accordion-item]"), this.$tabs.each(function (e, i) {
          var n = t(i), s = n.children("[data-tab-content]"), o = s[0].id || Foundation.GetYoDigits(6, "accordion"), r = i.id || o + "-label";
          n.find("a:first").attr({
            "aria-controls": o,
            role: "tab",
            id: r,
            "aria-expanded": !1,
            "aria-selected": !1
          }), s.attr({ role: "tabpanel", "aria-labelledby": r, "aria-hidden": !0, id: o })
        });
        var e = this.$element.find(".is-active").children("[data-tab-content]");
        e.length && this.down(e, !0), this._events()
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        this.$tabs.each(function () {
          var i = t(this), n = i.children("[data-tab-content]");
          n.length && i.children("a").off("click.zf.accordion keydown.zf.accordion").on("click.zf.accordion", function (t) {
            t.preventDefault(), e.toggle(n)
          }).on("keydown.zf.accordion", function (t) {
            Foundation.Keyboard.handleKey(t, "Accordion", {
              toggle: function () {
                e.toggle(n)
              }, next: function () {
                var t = i.next().find("a").focus();
                e.options.multiExpand || t.trigger("click.zf.accordion")
              }, previous: function () {
                var t = i.prev().find("a").focus();
                e.options.multiExpand || t.trigger("click.zf.accordion")
              }, handled: function () {
                t.preventDefault(), t.stopPropagation()
              }
            })
          })
        })
      }
    }, {
      key: "toggle", value: function (t) {
        t.parent().hasClass("is-active") ? this.up(t) : this.down(t)
      }
    }, {
      key: "down", value: function (e, i) {
        var n = this;
        if (e.attr("aria-hidden", !1).parent("[data-tab-content]").addBack().parent().addClass("is-active"), !this.options.multiExpand && !i) {
          var s = this.$element.children(".is-active").children("[data-tab-content]");
          s.length && this.up(s.not(e))
        }
        e.slideDown(this.options.slideSpeed, function () {
          n.$element.trigger("down.zf.accordion", [e])
        }), t("#" + e.attr("aria-labelledby")).attr({ "aria-expanded": !0, "aria-selected": !0 })
      }
    }, {
      key: "up", value: function (e) {
        var i = e.parent().siblings(), n = this;
        (this.options.allowAllClosed || i.hasClass("is-active")) && e.parent().hasClass("is-active") && (e.slideUp(n.options.slideSpeed, function () {
          n.$element.trigger("up.zf.accordion", [e])
        }), e.attr("aria-hidden", !0).parent().removeClass("is-active"),
          t("#" + e.attr("aria-labelledby")).attr({ "aria-expanded": !1, "aria-selected": !1 }))
      }
    }, {
      key: "destroy", value: function () {
        this.$element.find("[data-tab-content]").stop(!0).slideUp(0).css("display", ""), this.$element.find("a").off(".zf.accordion"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = { slideSpeed: 250, multiExpand: !1, allowAllClosed: !1 }, Foundation.plugin(e, "Accordion")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), Foundation.Nest.Feather(this.$element, "accordion"), this._init(), Foundation.registerPlugin(this, "AccordionMenu"), Foundation.Keyboard.register("AccordionMenu", {
        ENTER: "toggle",
        SPACE: "toggle",
        ARROW_RIGHT: "open",
        ARROW_UP: "up",
        ARROW_DOWN: "down",
        ARROW_LEFT: "close",
        ESCAPE: "closeAll"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this.$element.find("[data-submenu]").not(".is-active").slideUp(0), this.$element.attr({
          role: "menu",
          "aria-multiselectable": this.options.multiOpen
        }), this.$menuLinks = this.$element.find(".is-accordion-submenu-parent"), this.$menuLinks.each(function () {
          var e = this.id || Foundation.GetYoDigits(6, "acc-menu-link"), i = t(this), n = i.children("[data-submenu]"), s = n[0].id || Foundation.GetYoDigits(6, "acc-menu"), o = n.hasClass("is-active");
          i.attr({ "aria-controls": s, "aria-expanded": o, role: "menuitem", id: e }), n.attr({
            "aria-labelledby": e,
            "aria-hidden": !o,
            role: "menu",
            id: s
          })
        });
        var e = this.$element.find(".is-active");
        if (e.length) {
          var i = this;
          e.each(function () {
            i.down(t(this))
          })
        }
        this._events()
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        this.$element.find("li").each(function () {
          var i = t(this).children("[data-submenu]");
          i.length && t(this).children("a").off("click.zf.accordionMenu").on("click.zf.accordionMenu", function (t) {
            t.preventDefault(), e.toggle(i)
          })
        }).on("keydown.zf.accordionmenu", function (i) {
          var n, s, o = t(this), r = o.parent("ul").children("li"), a = o.children("[data-submenu]");
          r.each(function (e) {
            if (t(this).is(o))return n = r.eq(Math.max(0, e - 1)).find("a").first(), s = r.eq(Math.min(e + 1, r.length - 1)).find("a").first(), t(this).children("[data-submenu]:visible").length && (s = o.find("li:first-child").find("a").first()), t(this).is(":first-child") ? n = o.parents("li").first().find("a").first() : n.parents("li").first().children("[data-submenu]:visible").length && (n = n.parents("li").find("li:last-child").find("a").first()), void(t(this).is(":last-child") && (s = o.parents("li").first().next("li").find("a").first()))
          }), Foundation.Keyboard.handleKey(i, "AccordionMenu", {
            open: function () {
              a.is(":hidden") && (e.down(a), a.find("li").first().find("a").first().focus())
            }, close: function () {
              a.length && !a.is(":hidden") ? e.up(a) : o.parent("[data-submenu]").length && (e.up(o.parent("[data-submenu]")), o.parents("li").first().find("a").first().focus())
            }, up: function () {
              return n.focus(), !0
            }, down: function () {
              return s.focus(), !0
            }, toggle: function () {
              o.children("[data-submenu]").length && e.toggle(o.children("[data-submenu]"))
            }, closeAll: function () {
              e.hideAll()
            }, handled: function (t) {
              t && i.preventDefault(), i.stopImmediatePropagation()
            }
          })
        })
      }
    }, {
      key: "hideAll", value: function () {
        this.up(this.$element.find("[data-submenu]"))
      }
    }, {
      key: "showAll", value: function () {
        this.down(this.$element.find("[data-submenu]"))
      }
    }, {
      key: "toggle", value: function (t) {
        t.is(":animated") || (t.is(":hidden") ? this.down(t) : this.up(t))
      }
    }, {
      key: "down", value: function (t) {
        var e = this;
        this.options.multiOpen || this.up(this.$element.find(".is-active").not(t.parentsUntil(this.$element).add(t))), t.addClass("is-active").attr({ "aria-hidden": !1 }).parent(".is-accordion-submenu-parent").attr({ "aria-expanded": !0 }), t.slideDown(e.options.slideSpeed, function () {
          e.$element.trigger("down.zf.accordionMenu", [t])
        })
      }
    }, {
      key: "up", value: function (t) {
        var e = this;
        t.slideUp(e.options.slideSpeed, function () {
          e.$element.trigger("up.zf.accordionMenu", [t])
        });
        var i = t.find("[data-submenu]").slideUp(0).addBack().attr("aria-hidden", !0);
        i.parent(".is-accordion-submenu-parent").attr("aria-expanded", !1)
      }
    }, {
      key: "destroy", value: function () {
        this.$element.find("[data-submenu]").slideDown(0).css("display", ""), this.$element.find("a").off("click.zf.accordionMenu"), Foundation.Nest.Burn(this.$element, "accordion"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = { slideSpeed: 250, multiOpen: !0 }, Foundation.plugin(e, "AccordionMenu")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), Foundation.Nest.Feather(this.$element, "drilldown"), this._init(), Foundation.registerPlugin(this, "Drilldown"), Foundation.Keyboard.register("Drilldown", {
        ENTER: "open",
        SPACE: "open",
        ARROW_RIGHT: "next",
        ARROW_UP: "up",
        ARROW_DOWN: "down",
        ARROW_LEFT: "previous",
        ESCAPE: "close",
        TAB: "down",
        SHIFT_TAB: "up"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this.$submenuAnchors = this.$element.find("li.is-drilldown-submenu-parent").children("a"), this.$submenus = this.$submenuAnchors.parent("li").children("[data-submenu]"), this.$menuItems = this.$element.find("li").not(".js-drilldown-back").attr("role", "menuitem").find("a"), this.$element.attr("data-mutate", this.$element.attr("data-drilldown") || Foundation.GetYoDigits(6, "drilldown")), this._prepareMenu(), this._registerEvents(), this._keyboardEvents()
      }
    }, {
      key: "_prepareMenu", value: function () {
        var e = this;
        this.$submenuAnchors.each(function () {
          var i = t(this), n = i.parent();
          e.options.parentLink && i.clone().prependTo(n.children("[data-submenu]")).wrap('<li class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="menu-item"></li>'), i.data("savedHref", i.attr("href")).removeAttr("href").attr("tabindex", 0), i.children("[data-submenu]").attr({
            "aria-hidden": !0,
            tabindex: 0,
            role: "menu"
          }), e._events(i)
        }), this.$submenus.each(function () {
          var i = t(this), n = i.find(".js-drilldown-back");
          if (!n.length)switch (e.options.backButtonPosition) {
            case"bottom":
              i.append(e.options.backButton);
              break;
            case"top":
              i.prepend(e.options.backButton);
              break;
            default:
              console.error("Unsupported backButtonPosition value '" + e.options.backButtonPosition + "'")
          }
          e._back(i)
        }), this.options.autoHeight || this.$submenus.addClass("drilldown-submenu-cover-previous"), this.$element.parent().hasClass("is-drilldown") || (this.$wrapper = t(this.options.wrapper).addClass("is-drilldown"), this.options.animateHeight && this.$wrapper.addClass("animate-height"), this.$wrapper = this.$element.wrap(this.$wrapper).parent().css(this._getMaxDims()))
      }
    }, {
      key: "_resize", value: function () {
        this.$wrapper.css({ "max-width": "none", "min-height": "none" }), this.$wrapper.css(this._getMaxDims())
      }
    }, {
      key: "_events", value: function (e) {
        var i = this;
        e.off("click.zf.drilldown").on("click.zf.drilldown", function (n) {
          if (t(n.target).parentsUntil("ul", "li").hasClass("is-drilldown-submenu-parent") && (n.stopImmediatePropagation(), n.preventDefault()), i._show(e.parent("li")), i.options.closeOnClick) {
            var s = t("body");
            s.off(".zf.drilldown").on("click.zf.drilldown", function (e) {
              e.target === i.$element[0] || t.contains(i.$element[0], e.target) || (e.preventDefault(), i._hideAll(), s.off(".zf.drilldown"))
            })
          }
        }), this.$element.on("mutateme.zf.trigger", this._resize.bind(this))
      }
    }, {
      key: "_registerEvents", value: function () {
        this.options.scrollTop && (this._bindHandler = this._scrollTop.bind(this), this.$element.on("open.zf.drilldown hide.zf.drilldown closed.zf.drilldown", this._bindHandler))
      }
    }, {
      key: "_scrollTop", value: function () {
        var e = this, i = "" != e.options.scrollTopElement ? t(e.options.scrollTopElement) : e.$element, n = parseInt(i.offset().top + e.options.scrollTopOffset);
        t("html, body").stop(!0).animate({ scrollTop: n }, e.options.animationDuration, e.options.animationEasing, function () {
          this === t("html")[0] && e.$element.trigger("scrollme.zf.drilldown")
        })
      }
    }, {
      key: "_keyboardEvents", value: function () {
        var e = this;
        this.$menuItems.add(this.$element.find(".js-drilldown-back > a, .is-submenu-parent-item > a")).on("keydown.zf.drilldown", function (i) {
          var n, s, o = t(this), r = o.parent("li").parent("ul").children("li").children("a");
          r.each(function (e) {
            if (t(this).is(o))return n = r.eq(Math.max(0, e - 1)), void(s = r.eq(Math.min(e + 1, r.length - 1)))
          }), Foundation.Keyboard.handleKey(i, "Drilldown", {
            next: function () {
              if (o.is(e.$submenuAnchors))return e._show(o.parent("li")), o.parent("li").one(Foundation.transitionend(o), function () {
                o.parent("li").find("ul li a").filter(e.$menuItems).first().focus()
              }), !0
            }, previous: function () {
              return e._hide(o.parent("li").parent("ul")), o.parent("li").parent("ul").one(Foundation.transitionend(o), function () {
                setTimeout(function () {
                  o.parent("li").parent("ul").parent("li").children("a").first().focus()
                }, 1)
              }), !0
            }, up: function () {
              return n.focus(), !0
            }, down: function () {
              return s.focus(), !0
            }, close: function () {
              e._back()
            }, open: function () {
              return o.is(e.$menuItems) ? o.is(e.$submenuAnchors) ? (e._show(o.parent("li")), o.parent("li").one(Foundation.transitionend(o), function () {
                    o.parent("li").find("ul li a").filter(e.$menuItems).first().focus()
                  }), !0) : void 0 : (e._hide(o.parent("li").parent("ul")), o.parent("li").parent("ul").one(Foundation.transitionend(o), function () {
                  setTimeout(function () {
                    o.parent("li").parent("ul").parent("li").children("a").first().focus()
                  }, 1)
                }), !0)
            }, handled: function (t) {
              t && i.preventDefault(), i.stopImmediatePropagation()
            }
          })
        })
      }
    }, {
      key: "_hideAll", value: function () {
        var t = this.$element.find(".is-drilldown-submenu.is-active").addClass("is-closing");
        this.options.autoHeight && this.$wrapper.css({ height: t.parent().closest("ul").data("calcHeight") }), t.one(Foundation.transitionend(t), function (e) {
          t.removeClass("is-active is-closing")
        }), this.$element.trigger("closed.zf.drilldown")
      }
    }, {
      key: "_back", value: function (t) {
        var e = this;
        t.off("click.zf.drilldown"), t.children(".js-drilldown-back").on("click.zf.drilldown", function (i) {
          i.stopImmediatePropagation(), e._hide(t);
          var n = t.parent("li").parent("ul").parent("li");
          n.length && e._show(n)
        })
      }
    }, {
      key: "_menuLinkEvents", value: function () {
        var t = this;
        this.$menuItems.not(".is-drilldown-submenu-parent").off("click.zf.drilldown").on("click.zf.drilldown", function (e) {
          setTimeout(function () {
            t._hideAll()
          }, 0)
        })
      }
    }, {
      key: "_show", value: function (t) {
        this.options.autoHeight && this.$wrapper.css({ height: t.children("[data-submenu]").data("calcHeight") }), t.attr("aria-expanded", !0), t.children("[data-submenu]").addClass("is-active").attr("aria-hidden", !1), this.$element.trigger("open.zf.drilldown", [t])
      }
    }, {
      key: "_hide", value: function (t) {
        this.options.autoHeight && this.$wrapper.css({ height: t.parent().closest("ul").data("calcHeight") });
        t.parent("li").attr("aria-expanded", !1), t.attr("aria-hidden", !0).addClass("is-closing"), t.addClass("is-closing").one(Foundation.transitionend(t), function () {
          t.removeClass("is-active is-closing"), t.blur()
        }), t.trigger("hide.zf.drilldown", [t])
      }
    }, {
      key: "_getMaxDims", value: function () {
        var e = 0, i = {}, n = this;
        return this.$submenus.add(this.$element).each(function () {
          var s = (t(this).children("li").length, Foundation.Box.GetDimensions(this).height);
          e = s > e ? s : e, n.options.autoHeight && (t(this).data("calcHeight", s), t(this).hasClass("is-drilldown-submenu") || (i.height = s))
        }), this.options.autoHeight || (i["min-height"] = e + "px"), i["max-width"] = this.$element[0].getBoundingClientRect().width + "px", i
      }
    }, {
      key: "destroy", value: function () {
        this.options.scrollTop && this.$element.off(".zf.drilldown", this._bindHandler), this._hideAll(), this.$element.off("mutateme.zf.trigger"), Foundation.Nest.Burn(this.$element, "drilldown"), this.$element.unwrap().find(".js-drilldown-back, .is-submenu-parent-item").remove().end().find(".is-active, .is-closing, .is-drilldown-submenu").removeClass("is-active is-closing is-drilldown-submenu").end().find("[data-submenu]").removeAttr("aria-hidden tabindex role"), this.$submenuAnchors.each(function () {
          t(this).off(".zf.drilldown")
        }), this.$submenus.removeClass("drilldown-submenu-cover-previous"), this.$element.find("a").each(function () {
          var e = t(this);
          e.removeAttr("tabindex"), e.data("savedHref") && e.attr("href", e.data("savedHref")).removeData("savedHref")
        }), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    backButton: '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',
    backButtonPosition: "top",
    wrapper: "<div></div>",
    parentLink: !1,
    closeOnClick: !1,
    autoHeight: !1,
    animateHeight: !1,
    scrollTop: !1,
    scrollTopElement: "",
    scrollTopOffset: 0,
    animationDuration: 500,
    animationEasing: "swing"
  }, Foundation.plugin(e, "Drilldown")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Dropdown"), Foundation.Keyboard.register("Dropdown", {
        ENTER: "open",
        SPACE: "open",
        ESCAPE: "close"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element.attr("id");
        this.$anchor = t(t('[data-toggle="' + e + '"]').length ? '[data-toggle="' + e + '"]' : '[data-open="' + e + '"]'), this.$anchor.attr({
          "aria-controls": e,
          "data-is-focus": !1,
          "data-yeti-box": e,
          "aria-haspopup": !0,
          "aria-expanded": !1
        }), this.options.parentClass ? this.$parent = this.$element.parents("." + this.options.parentClass) : this.$parent = null, this.options.positionClass = this.getPositionClass(), this.counter = 4, this.usedPositions = [], this.$element.attr({
          "aria-hidden": "true",
          "data-yeti-box": e,
          "data-resize": e,
          "aria-labelledby": this.$anchor[0].id || Foundation.GetYoDigits(6, "dd-anchor")
        }), this._events()
      }
    }, {
      key: "getPositionClass", value: function () {
        var t = this.$element[0].className.match(/(top|left|right|bottom)/g);
        t = t ? t[0] : "";
        var e = /float-(\S+)/.exec(this.$anchor[0].className);
        e = e ? e[1] : "";
        var i = e ? e + " " + t : t;
        return i
      }
    }, {
      key: "_reposition", value: function (t) {
        this.usedPositions.push(t ? t : "bottom"), !t && this.usedPositions.indexOf("top") < 0 ? this.$element.addClass("top") : "top" === t && this.usedPositions.indexOf("bottom") < 0 ? this.$element.removeClass(t) : "left" === t && this.usedPositions.indexOf("right") < 0 ? this.$element.removeClass(t).addClass("right") : "right" === t && this.usedPositions.indexOf("left") < 0 ? this.$element.removeClass(t).addClass("left") : !t && this.usedPositions.indexOf("top") > -1 && this.usedPositions.indexOf("left") < 0 ? this.$element.addClass("left") : "top" === t && this.usedPositions.indexOf("bottom") > -1 && this.usedPositions.indexOf("left") < 0 ? this.$element.removeClass(t).addClass("left") : "left" === t && this.usedPositions.indexOf("right") > -1 && this.usedPositions.indexOf("bottom") < 0 ? this.$element.removeClass(t) : "right" === t && this.usedPositions.indexOf("left") > -1 && this.usedPositions.indexOf("bottom") < 0 ? this.$element.removeClass(t) : this.$element.removeClass(t), this.classChanged = !0, this.counter--
      }
    }, {
      key: "_setPosition", value: function () {
        if ("false" === this.$anchor.attr("aria-expanded"))return !1;
        var t = this.getPositionClass(), e = Foundation.Box.GetDimensions(this.$element), i = (Foundation.Box.GetDimensions(this.$anchor), "left" === t ? "left" : "right" === t ? "left" : "top"), n = "top" === i ? "height" : "width";
        "height" === n ? this.options.vOffset : this.options.hOffset;
        if (e.width >= e.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.$element, this.$parent)) {
          var s = e.windowDims.width, o = 0;
          if (this.$parent) {
            var r = Foundation.Box.GetDimensions(this.$parent), o = r.offset.left;
            r.width < s && (s = r.width)
          }
          return this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, "center bottom", this.options.vOffset, this.options.hOffset + o, !0)).css({
            width: s - 2 * this.options.hOffset,
            height: "auto"
          }), this.classChanged = !0, !1
        }
        for (this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, t, this.options.vOffset, this.options.hOffset)); !Foundation.Box.ImNotTouchingYou(this.$element, this.$parent, !0) && this.counter;)this._reposition(t), this._setPosition()
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        this.$element.on({
          "open.zf.trigger": this.open.bind(this),
          "close.zf.trigger": this.close.bind(this),
          "toggle.zf.trigger": this.toggle.bind(this),
          "resizeme.zf.trigger": this._setPosition.bind(this)
        }), this.options.hover && (this.$anchor.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown", function () {
          var i = t("body").data();
          "undefined" != typeof i.whatinput && "mouse" !== i.whatinput || (clearTimeout(e.timeout), e.timeout = setTimeout(function () {
            e.open(), e.$anchor.data("hover", !0)
          }, e.options.hoverDelay))
        }).on("mouseleave.zf.dropdown", function () {
          clearTimeout(e.timeout), e.timeout = setTimeout(function () {
            e.close(), e.$anchor.data("hover", !1)
          }, e.options.hoverDelay)
        }), this.options.hoverPane && this.$element.off("mouseenter.zf.dropdown mouseleave.zf.dropdown").on("mouseenter.zf.dropdown", function () {
          clearTimeout(e.timeout)
        }).on("mouseleave.zf.dropdown", function () {
          clearTimeout(e.timeout), e.timeout = setTimeout(function () {
            e.close(), e.$anchor.data("hover", !1)
          }, e.options.hoverDelay)
        })), this.$anchor.add(this.$element).on("keydown.zf.dropdown", function (i) {
          var n = t(this);
          Foundation.Keyboard.findFocusable(e.$element);
          Foundation.Keyboard.handleKey(i, "Dropdown", {
            open: function () {
              n.is(e.$anchor) && (e.open(), e.$element.attr("tabindex", -1).focus(), i.preventDefault())
            }, close: function () {
              e.close(), e.$anchor.focus()
            }
          })
        })
      }
    }, {
      key: "_addBodyHandler", value: function () {
        var e = t(document.body).not(this.$element), i = this;
        e.off("click.zf.dropdown").on("click.zf.dropdown", function (t) {
          i.$anchor.is(t.target) || i.$anchor.find(t.target).length || i.$element.find(t.target).length || (i.close(), e.off("click.zf.dropdown"))
        })
      }
    }, {
      key: "open", value: function () {
        if (this.$element.trigger("closeme.zf.dropdown", this.$element.attr("id")), this.$anchor.addClass("hover").attr({ "aria-expanded": !0 }), this._setPosition(), this.$element.addClass("is-open").attr({ "aria-hidden": !1 }), this.options.autoFocus) {
          var t = Foundation.Keyboard.findFocusable(this.$element);
          t.length && t.eq(0).focus()
        }
        this.options.closeOnClick && this._addBodyHandler(), this.options.trapFocus && Foundation.Keyboard.trapFocus(this.$element), this.$element.trigger("show.zf.dropdown", [this.$element])
      }
    }, {
      key: "close", value: function () {
        if (!this.$element.hasClass("is-open"))return !1;
        if (this.$element.removeClass("is-open").attr({ "aria-hidden": !0 }), this.$anchor.removeClass("hover").attr("aria-expanded", !1), this.classChanged) {
          var t = this.getPositionClass();
          t && this.$element.removeClass(t), this.$element.addClass(this.options.positionClass).css({
            height: "",
            width: ""
          }), this.classChanged = !1, this.counter = 4, this.usedPositions.length = 0
        }
        this.$element.trigger("hide.zf.dropdown", [this.$element]), this.options.trapFocus && Foundation.Keyboard.releaseFocus(this.$element)
      }
    }, {
      key: "toggle", value: function () {
        if (this.$element.hasClass("is-open")) {
          if (this.$anchor.data("hover"))return;
          this.close()
        } else this.open()
      }
    }, {
      key: "destroy", value: function () {
        this.$element.off(".zf.trigger").hide(), this.$anchor.off(".zf.dropdown"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    parentClass: null,
    hoverDelay: 250,
    hover: !1,
    hoverPane: !1,
    vOffset: 1,
    hOffset: 1,
    positionClass: "",
    trapFocus: !1,
    autoFocus: !1,
    closeOnClick: !1
  }, Foundation.plugin(e, "Dropdown")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), Foundation.Nest.Feather(this.$element, "dropdown"), this._init(), Foundation.registerPlugin(this, "DropdownMenu"), Foundation.Keyboard.register("DropdownMenu", {
        ENTER: "open",
        SPACE: "open",
        ARROW_RIGHT: "next",
        ARROW_UP: "up",
        ARROW_DOWN: "down",
        ARROW_LEFT: "previous",
        ESCAPE: "close"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var t = this.$element.find("li.is-dropdown-submenu-parent");
        this.$element.children(".is-dropdown-submenu-parent").children(".is-dropdown-submenu").addClass("first-sub"), this.$menuItems = this.$element.find('[role="menuitem"]'), this.$tabs = this.$element.children('[role="menuitem"]'), this.$tabs.find("ul.is-dropdown-submenu").addClass(this.options.verticalClass), this.$element.hasClass(this.options.rightClass) || "right" === this.options.alignment || Foundation.rtl() || this.$element.parents(".top-bar-right").is("*") ? (this.options.alignment = "right", t.addClass("opens-left")) : t.addClass("opens-right"), this.changed = !1, this._events()
      }
    }, {
      key: "_isVertical", value: function () {
        return "block" === this.$tabs.css("display")
      }
    }, {
      key: "_events", value: function () {
        var e = this, i = "ontouchstart" in window || "undefined" != typeof window.ontouchstart, n = "is-dropdown-submenu-parent", s = function (s) {
          var o = t(s.target).parentsUntil("ul", "." + n), r = o.hasClass(n), a = "true" === o.attr("data-is-click"), l = o.children(".is-dropdown-submenu");
          if (r)if (a) {
            if (!e.options.closeOnClick || !e.options.clickOpen && !i || e.options.forceFollow && i)return;
            s.stopImmediatePropagation(), s.preventDefault(), e._hide(o)
          } else s.preventDefault(), s.stopImmediatePropagation(), e._show(l), o.add(o.parentsUntil(e.$element, "." + n)).attr("data-is-click", !0)
        };
        (this.options.clickOpen || i) && this.$menuItems.on("click.zf.dropdownmenu touchstart.zf.dropdownmenu", s), e.options.closeOnClickInside && this.$menuItems.on("click.zf.dropdownmenu touchend.zf.dropdownmenu", function (i) {
          var s = t(this), o = s.hasClass(n);
          o || e._hide()
        }), this.options.disableHover || this.$menuItems.on("mouseenter.zf.dropdownmenu", function (i) {
          var s = t(this), o = s.hasClass(n);
          o && (clearTimeout(s.data("_delay")), s.data("_delay", setTimeout(function () {
            e._show(s.children(".is-dropdown-submenu"))
          }, e.options.hoverDelay)))
        }).on("mouseleave.zf.dropdownmenu", function (i) {
          var s = t(this), o = s.hasClass(n);
          if (o && e.options.autoclose) {
            if ("true" === s.attr("data-is-click") && e.options.clickOpen)return !1;
            clearTimeout(s.data("_delay")), s.data("_delay", setTimeout(function () {
              e._hide(s)
            }, e.options.closingTime))
          }
        }), this.$menuItems.on("keydown.zf.dropdownmenu", function (i) {
          var n, s, o = t(i.target).parentsUntil("ul", '[role="menuitem"]'), r = e.$tabs.index(o) > -1, a = r ? e.$tabs : o.siblings("li").add(o);
          a.each(function (e) {
            if (t(this).is(o))return n = a.eq(e - 1), void(s = a.eq(e + 1))
          });
          var l = function () {
            o.is(":last-child") || (s.children("a:first").focus(), i.preventDefault())
          }, u = function () {
            n.children("a:first").focus(), i.preventDefault()
          }, d = function () {
            var t = o.children("ul.is-dropdown-submenu");
            t.length && (e._show(t), o.find("li > a:first").focus(), i.preventDefault())
          }, c = function () {
            var t = o.parent("ul").parent("li");
            t.children("a:first").focus(), e._hide(t), i.preventDefault()
          }, h = {
            open: d, close: function () {
              e._hide(e.$element), e.$menuItems.find("a:first").focus(), i.preventDefault()
            }, handled: function () {
              i.stopImmediatePropagation()
            }
          };
          r ? e._isVertical() ? Foundation.rtl() ? t.extend(h, {
                  down: l,
                  up: u,
                  next: c,
                  previous: d
                }) : t.extend(h, { down: l, up: u, next: d, previous: c }) : Foundation.rtl() ? t.extend(h, {
                  next: u,
                  previous: l,
                  down: d,
                  up: c
                }) : t.extend(h, { next: l, previous: u, down: d, up: c }) : Foundation.rtl() ? t.extend(h, {
                next: c,
                previous: d,
                down: l,
                up: u
              }) : t.extend(h, {
                next: d,
                previous: c,
                down: l,
                up: u
              }), Foundation.Keyboard.handleKey(i, "DropdownMenu", h)
        })
      }
    }, {
      key: "_addBodyHandler", value: function () {
        var e = t(document.body), i = this;
        e.off("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu").on("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu", function (t) {
          var n = i.$element.find(t.target);
          n.length || (i._hide(), e.off("mouseup.zf.dropdownmenu touchend.zf.dropdownmenu"))
        })
      }
    }, {
      key: "_show", value: function (e) {
        var i = this.$tabs.index(this.$tabs.filter(function (i, n) {
          return t(n).find(e).length > 0
        })), n = e.parent("li.is-dropdown-submenu-parent").siblings("li.is-dropdown-submenu-parent");
        this._hide(n, i), e.css("visibility", "hidden").addClass("js-dropdown-active").parent("li.is-dropdown-submenu-parent").addClass("is-active");
        var s = Foundation.Box.ImNotTouchingYou(e, null, !0);
        if (!s) {
          var o = "left" === this.options.alignment ? "-right" : "-left", r = e.parent(".is-dropdown-submenu-parent");
          r.removeClass("opens" + o).addClass("opens-" + this.options.alignment), s = Foundation.Box.ImNotTouchingYou(e, null, !0), s || r.removeClass("opens-" + this.options.alignment).addClass("opens-inner"), this.changed = !0
        }
        e.css("visibility", ""), this.options.closeOnClick && this._addBodyHandler(), this.$element.trigger("show.zf.dropdownmenu", [e])
      }
    }, {
      key: "_hide", value: function (t, e) {
        var i;
        i = t && t.length ? t : void 0 !== e ? this.$tabs.not(function (t, i) {
              return t === e
            }) : this.$element;
        var n = i.hasClass("is-active") || i.find(".is-active").length > 0;
        if (n) {
          if (i.find("li.is-active").add(i).attr({ "data-is-click": !1 }).removeClass("is-active"), i.find("ul.js-dropdown-active").removeClass("js-dropdown-active"), this.changed || i.find("opens-inner").length) {
            var s = "left" === this.options.alignment ? "right" : "left";
            i.find("li.is-dropdown-submenu-parent").add(i).removeClass("opens-inner opens-" + this.options.alignment).addClass("opens-" + s), this.changed = !1
          }
          this.$element.trigger("hide.zf.dropdownmenu", [i])
        }
      }
    }, {
      key: "destroy", value: function () {
        this.$menuItems.off(".zf.dropdownmenu").removeAttr("data-is-click").removeClass("is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner"), t(document.body).off(".zf.dropdownmenu"), Foundation.Nest.Burn(this.$element, "dropdown"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    disableHover: !1,
    autoclose: !0,
    hoverDelay: 50,
    clickOpen: !1,
    closingTime: 500,
    alignment: "left",
    closeOnClick: !0,
    closeOnClickInside: !0,
    verticalClass: "vertical",
    rightClass: "align-right",
    forceFollow: !0
  }, Foundation.plugin(e, "DropdownMenu")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Equalizer")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element.attr("data-equalizer") || "", i = this.$element.find('[data-equalizer-watch="' + e + '"]');
        this.$watched = i.length ? i : this.$element.find("[data-equalizer-watch]"), this.$element.attr("data-resize", e || Foundation.GetYoDigits(6, "eq")), this.$element.attr("data-mutate", e || Foundation.GetYoDigits(6, "eq")), this.hasNested = this.$element.find("[data-equalizer]").length > 0, this.isNested = this.$element.parentsUntil(document.body, "[data-equalizer]").length > 0, this.isOn = !1, this._bindHandler = {
          onResizeMeBound: this._onResizeMe.bind(this),
          onPostEqualizedBound: this._onPostEqualized.bind(this)
        };
        var n, s = this.$element.find("img");
        this.options.equalizeOn ? (n = this._checkMQ(), t(window).on("changed.zf.mediaquery", this._checkMQ.bind(this))) : this._events(), (void 0 !== n && n === !1 || void 0 === n) && (s.length ? Foundation.onImagesLoaded(s, this._reflow.bind(this)) : this._reflow())
      }
    }, {
      key: "_pauseEvents", value: function () {
        this.isOn = !1, this.$element.off({
          ".zf.equalizer": this._bindHandler.onPostEqualizedBound,
          "resizeme.zf.trigger": this._bindHandler.onResizeMeBound,
          "mutateme.zf.trigger": this._bindHandler.onResizeMeBound
        })
      }
    }, {
      key: "_onResizeMe", value: function (t) {
        this._reflow()
      }
    }, {
      key: "_onPostEqualized", value: function (t) {
        t.target !== this.$element[0] && this._reflow()
      }
    }, {
      key: "_events", value: function () {
        this._pauseEvents(), this.hasNested ? this.$element.on("postequalized.zf.equalizer", this._bindHandler.onPostEqualizedBound) : (this.$element.on("resizeme.zf.trigger", this._bindHandler.onResizeMeBound), this.$element.on("mutateme.zf.trigger", this._bindHandler.onResizeMeBound)), this.isOn = !0
      }
    }, {
      key: "_checkMQ", value: function () {
        var t = !Foundation.MediaQuery.is(this.options.equalizeOn);
        return t ? this.isOn && (this._pauseEvents(), this.$watched.css("height", "auto")) : this.isOn || this._events(), t
      }
    }, {
      key: "_killswitch", value: function () {
      }
    }, {
      key: "_reflow", value: function () {
        return !this.options.equalizeOnStack && this._isStacked() ? (this.$watched.css("height", "auto"), !1) : void(this.options.equalizeByRow ? this.getHeightsByRow(this.applyHeightByRow.bind(this)) : this.getHeights(this.applyHeight.bind(this)))
      }
    }, {
      key: "_isStacked", value: function () {
        return !this.$watched[0] || !this.$watched[1] || this.$watched[0].getBoundingClientRect().top !== this.$watched[1].getBoundingClientRect().top
      }
    }, {
      key: "getHeights", value: function (t) {
        for (var e = [], i = 0, n = this.$watched.length; i < n; i++)this.$watched[i].style.height = "auto", e.push(this.$watched[i].offsetHeight);
        t(e)
      }
    }, {
      key: "getHeightsByRow", value: function (e) {
        var i = this.$watched.length ? this.$watched.first().offset().top : 0, n = [], s = 0;
        n[s] = [];
        for (var o = 0, r = this.$watched.length; o < r; o++) {
          this.$watched[o].style.height = "auto";
          var a = t(this.$watched[o]).offset().top;
          a != i && (s++, n[s] = [], i = a), n[s].push([this.$watched[o], this.$watched[o].offsetHeight])
        }
        for (var l = 0, u = n.length; l < u; l++) {
          var d = t(n[l]).map(function () {
            return this[1]
          }).get(), c = Math.max.apply(null, d);
          n[l].push(c)
        }
        e(n)
      }
    }, {
      key: "applyHeight", value: function (t) {
        var e = Math.max.apply(null, t);
        this.$element.trigger("preequalized.zf.equalizer"), this.$watched.css("height", e), this.$element.trigger("postequalized.zf.equalizer")
      }
    }, {
      key: "applyHeightByRow", value: function (e) {
        this.$element.trigger("preequalized.zf.equalizer");
        for (var i = 0, n = e.length; i < n; i++) {
          var s = e[i].length, o = e[i][s - 1];
          if (s <= 2) t(e[i][0][0]).css({ height: "auto" }); else {
            this.$element.trigger("preequalizedrow.zf.equalizer");
            for (var r = 0, a = s - 1; r < a; r++)t(e[i][r][0]).css({ height: o });
            this.$element.trigger("postequalizedrow.zf.equalizer")
          }
        }
        this.$element.trigger("postequalized.zf.equalizer")
      }
    }, {
      key: "destroy", value: function () {
        this._pauseEvents(), this.$watched.css("height", "auto"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = { equalizeOnStack: !1, equalizeByRow: !1, equalizeOn: "" }, Foundation.plugin(e, "Equalizer")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, n), this.rules = [], this.currentPath = "", this._init(), this._events(), Foundation.registerPlugin(this, "Interchange")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this._addBreakpoints(), this._generateRules(), this._reflow()
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        t(window).on("resize.zf.interchange", Foundation.util.throttle(function () {
          e._reflow()
        }, 50))
      }
    }, {
      key: "_reflow", value: function () {
        var t;
        for (var e in this.rules)if (this.rules.hasOwnProperty(e)) {
          var i = this.rules[e];
          window.matchMedia(i.query).matches && (t = i)
        }
        t && this.replace(t.path)
      }
    }, {
      key: "_addBreakpoints", value: function () {
        for (var t in Foundation.MediaQuery.queries)if (Foundation.MediaQuery.queries.hasOwnProperty(t)) {
          var i = Foundation.MediaQuery.queries[t];
          e.SPECIAL_QUERIES[i.name] = i.value
        }
      }
    }, {
      key: "_generateRules", value: function (t) {
        var i, n = [];
        i = this.options.rules ? this.options.rules : this.$element.data("interchange").match(/\[.*?\]/g);
        for (var s in i)if (i.hasOwnProperty(s)) {
          var o = i[s].slice(1, -1).split(", "), r = o.slice(0, -1).join(""), a = o[o.length - 1];
          e.SPECIAL_QUERIES[a] && (a = e.SPECIAL_QUERIES[a]), n.push({ path: r, query: a })
        }
        this.rules = n
      }
    }, {
      key: "replace", value: function (e) {
        if (this.currentPath !== e) {
          var i = this, n = "replaced.zf.interchange";
          "IMG" === this.$element[0].nodeName ? this.$element.attr("src", e).on("load", function () {
              i.currentPath = e
            }).trigger(n) : e.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i) ? this.$element.css({ "background-image": "url(" + e + ")" }).trigger(n) : t.get(e, function (s) {
                i.$element.html(s).trigger(n), t(s).foundation(), i.currentPath = e
              })
        }
      }
    }, {
      key: "destroy", value: function () {
      }
    }]), e
  }();
  e.defaults = { rules: null }, e.SPECIAL_QUERIES = {
    landscape: "screen and (orientation: landscape)",
    portrait: "screen and (orientation: portrait)",
    retina: "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"
  }, Foundation.plugin(e, "Interchange")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), this.calcPoints(), Foundation.registerPlugin(this, "Magellan")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element[0].id || Foundation.GetYoDigits(6, "magellan");
        this.$targets = t("[data-magellan-target]"), this.$links = this.$element.find("a"), this.$element.attr({
          "data-resize": e,
          "data-scroll": e,
          id: e
        }), this.$active = t(), this.scrollPos = parseInt(window.pageYOffset, 10), this._events()
      }
    }, {
      key: "calcPoints", value: function () {
        var e = this, i = document.body, n = document.documentElement;
        this.points = [], this.winHeight = Math.round(Math.max(window.innerHeight, n.clientHeight)), this.docHeight = Math.round(Math.max(i.scrollHeight, i.offsetHeight, n.clientHeight, n.scrollHeight, n.offsetHeight)), this.$targets.each(function () {
          var i = t(this), n = Math.round(i.offset().top - e.options.threshold);
          i.targetPoint = n, e.points.push(n)
        })
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        t("html, body"), { duration: e.options.animationDuration, easing: e.options.animationEasing };
        t(window).one("load", function () {
          e.options.deepLinking && location.hash && e.scrollToLoc(location.hash), e.calcPoints(), e._updateActive()
        }), this.$element.on({
          "resizeme.zf.trigger": this.reflow.bind(this),
          "scrollme.zf.trigger": this._updateActive.bind(this)
        }).on("click.zf.magellan", 'a[href^="#"]', function (t) {
          t.preventDefault();
          var i = this.getAttribute("href");
          e.scrollToLoc(i)
        }), t(window).on("popstate", function (t) {
          e.options.deepLinking && e.scrollToLoc(window.location.hash)
        })
      }
    }, {
      key: "scrollToLoc", value: function (e) {
        if (!t(e).length)return !1;
        this._inTransition = !0;
        var i = this, n = Math.round(t(e).offset().top - this.options.threshold / 2 - this.options.barOffset);
        t("html, body").stop(!0).animate({ scrollTop: n }, this.options.animationDuration, this.options.animationEasing, function () {
          i._inTransition = !1, i._updateActive()
        })
      }
    }, {
      key: "reflow", value: function () {
        this.calcPoints(), this._updateActive()
      }
    }, {
      key: "_updateActive", value: function () {
        if (!this._inTransition) {
          var t, e = parseInt(window.pageYOffset, 10);
          if (e + this.winHeight === this.docHeight) t = this.points.length - 1; else if (e < this.points[0]) t = void 0; else {
            var i = this.scrollPos < e, n = this, s = this.points.filter(function (t, s) {
              return i ? t - n.options.barOffset <= e : t - n.options.barOffset - n.options.threshold <= e
            });
            t = s.length ? s.length - 1 : 0
          }
          if (this.$active.removeClass(this.options.activeClass), this.$active = this.$links.filter('[href="#' + this.$targets.eq(t).data("magellan-target") + '"]').addClass(this.options.activeClass), this.options.deepLinking) {
            var o = "";
            void 0 != t && (o = this.$active[0].getAttribute("href")), o !== window.location.hash && (window.history.pushState ? window.history.pushState(null, null, o) : window.location.hash = o)
          }
          this.scrollPos = e, this.$element.trigger("update.zf.magellan", [this.$active])
        }
      }
    }, {
      key: "destroy", value: function () {
        if (this.$element.off(".zf.trigger .zf.magellan").find("." + this.options.activeClass).removeClass(this.options.activeClass), this.options.deepLinking) {
          var t = this.$active[0].getAttribute("href");
          window.location.hash.replace(t, "")
        }
        Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    animationDuration: 500,
    animationEasing: "linear",
    threshold: 50,
    activeClass: "active",
    deepLinking: !1,
    barOffset: 0
  }, Foundation.plugin(e, "Magellan")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this.$lastTrigger = t(), this.$triggers = t(), this._init(), this._events(), Foundation.registerPlugin(this, "OffCanvas"), Foundation.Keyboard.register("OffCanvas", { ESCAPE: "close" })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element.attr("id");
        if (this.$element.attr("aria-hidden", "true"), this.$element.addClass("is-transition-" + this.options.transition), this.$triggers = t(document).find('[data-open="' + e + '"], [data-close="' + e + '"], [data-toggle="' + e + '"]').attr("aria-expanded", "false").attr("aria-controls", e), this.options.contentOverlay === !0) {
          var i = document.createElement("div"), n = "fixed" === t(this.$element).css("position") ? "is-overlay-fixed" : "is-overlay-absolute";
          i.setAttribute("class", "js-off-canvas-overlay " + n), this.$overlay = t(i), "is-overlay-fixed" === n ? t("body").append(this.$overlay) : this.$element.siblings("[data-off-canvas-content]").append(this.$overlay)
        }
        this.options.isRevealed = this.options.isRevealed || new RegExp(this.options.revealClass, "g").test(this.$element[0].className), this.options.isRevealed === !0 && (this.options.revealOn = this.options.revealOn || this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split("-")[2], this._setMQChecker()), !this.options.transitionTime == !0 && (this.options.transitionTime = 1e3 * parseFloat(window.getComputedStyle(t("[data-off-canvas]")[0]).transitionDuration))
      }
    }, {
      key: "_events", value: function () {
        if (this.$element.off(".zf.trigger .zf.offcanvas").on({
            "open.zf.trigger": this.open.bind(this),
            "close.zf.trigger": this.close.bind(this),
            "toggle.zf.trigger": this.toggle.bind(this),
            "keydown.zf.offcanvas": this._handleKeyboard.bind(this)
          }), this.options.closeOnClick === !0) {
          var e = this.options.contentOverlay ? this.$overlay : t("[data-off-canvas-content]");
          e.on({ "click.zf.offcanvas": this.close.bind(this) })
        }
      }
    }, {
      key: "_setMQChecker", value: function () {
        var e = this;
        t(window).on("changed.zf.mediaquery", function () {
          Foundation.MediaQuery.atLeast(e.options.revealOn) ? e.reveal(!0) : e.reveal(!1)
        }).one("load.zf.offcanvas", function () {
          Foundation.MediaQuery.atLeast(e.options.revealOn) && e.reveal(!0)
        })
      }
    }, {
      key: "reveal", value: function (t) {
        var e = this.$element.find("[data-close]");
        t ? (this.close(), this.isRevealed = !0, this.$element.attr("aria-hidden", "false"), this.$element.off("open.zf.trigger toggle.zf.trigger"), e.length && e.hide()) : (this.isRevealed = !1, this.$element.attr("aria-hidden", "true"), this.$element.on({
            "open.zf.trigger": this.open.bind(this),
            "toggle.zf.trigger": this.toggle.bind(this)
          }), e.length && e.show())
      }
    }, {
      key: "_stopScrolling", value: function (t) {
        return !1
      }
    }, {
      key: "open", value: function (e, i) {
        if (!this.$element.hasClass("is-open") && !this.isRevealed) {
          var n = this;
          i && (this.$lastTrigger = i), "top" === this.options.forceTo ? window.scrollTo(0, 0) : "bottom" === this.options.forceTo && window.scrollTo(0, document.body.scrollHeight), n.$element.addClass("is-open"), this.$triggers.attr("aria-expanded", "true"), this.$element.attr("aria-hidden", "false").trigger("opened.zf.offcanvas"), this.options.contentScroll === !1 && t("body").addClass("is-off-canvas-open").on("touchmove", this._stopScrolling), this.options.contentOverlay === !0 && this.$overlay.addClass("is-visible"), this.options.closeOnClick === !0 && this.options.contentOverlay === !0 && this.$overlay.addClass("is-closable"), this.options.autoFocus === !0 && this.$element.one(Foundation.transitionend(this.$element), function () {
            n.$element.find("a, button").eq(0).focus()
          }), this.options.trapFocus === !0 && (this.$element.siblings("[data-off-canvas-content]").attr("tabindex", "-1"), Foundation.Keyboard.trapFocus(this.$element))
        }
      }
    }, {
      key: "close", value: function (e) {
        if (this.$element.hasClass("is-open") && !this.isRevealed) {
          var i = this;
          i.$element.removeClass("is-open"), this.$element.attr("aria-hidden", "true").trigger("closed.zf.offcanvas"), this.options.contentScroll === !1 && t("body").removeClass("is-off-canvas-open").off("touchmove", this._stopScrolling), this.options.contentOverlay === !0 && this.$overlay.removeClass("is-visible"), this.options.closeOnClick === !0 && this.options.contentOverlay === !0 && this.$overlay.removeClass("is-closable"), this.$triggers.attr("aria-expanded", "false"), this.options.trapFocus === !0 && (this.$element.siblings("[data-off-canvas-content]").removeAttr("tabindex"), Foundation.Keyboard.releaseFocus(this.$element))
        }
      }
    }, {
      key: "toggle", value: function (t, e) {
        this.$element.hasClass("is-open") ? this.close(t, e) : this.open(t, e)
      }
    }, {
      key: "_handleKeyboard", value: function (t) {
        var e = this;
        Foundation.Keyboard.handleKey(t, "OffCanvas", {
          close: function () {
            return e.close(), e.$lastTrigger.focus(), !0
          }, handled: function () {
            t.stopPropagation(), t.preventDefault()
          }
        })
      }
    }, {
      key: "destroy", value: function () {
        this.close(), this.$element.off(".zf.trigger .zf.offcanvas"), this.$overlay.off(".zf.offcanvas"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    closeOnClick: !0,
    contentOverlay: !0,
    contentScroll: !0,
    transitionTime: 0,
    transition: "push",
    forceTo: null,
    isRevealed: !1,
    revealOn: null,
    autoFocus: !0,
    revealClass: "reveal-for-",
    trapFocus: !1
  }, Foundation.plugin(e, "OffCanvas")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Orbit"), Foundation.Keyboard.register("Orbit", {
        ltr: {
          ARROW_RIGHT: "next",
          ARROW_LEFT: "previous"
        }, rtl: { ARROW_LEFT: "next", ARROW_RIGHT: "previous" }
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this._reset(), this.$wrapper = this.$element.find("." + this.options.containerClass), this.$slides = this.$element.find("." + this.options.slideClass);
        var t = this.$element.find("img"), e = this.$slides.filter(".is-active"), i = this.$element[0].id || Foundation.GetYoDigits(6, "orbit");
        this.$element.attr({
          "data-resize": i,
          id: i
        }), e.length || this.$slides.eq(0).addClass("is-active"), this.options.useMUI || this.$slides.addClass("no-motionui"), t.length ? Foundation.onImagesLoaded(t, this._prepareForOrbit.bind(this)) : this._prepareForOrbit(), this.options.bullets && this._loadBullets(), this._events(), this.options.autoPlay && this.$slides.length > 1 && this.geoSync(), this.options.accessible && this.$wrapper.attr("tabindex", 0)
      }
    }, {
      key: "_loadBullets", value: function () {
        this.$bullets = this.$element.find("." + this.options.boxOfBullets).find("button")
      }
    }, {
      key: "geoSync", value: function () {
        var t = this;
        this.timer = new Foundation.Timer(this.$element, {
          duration: this.options.timerDelay,
          infinite: !1
        }, function () {
          t.changeSlide(!0)
        }), this.timer.start()
      }
    }, {
      key: "_prepareForOrbit", value: function () {
        this._setWrapperHeight()
      }
    }, {
      key: "_setWrapperHeight", value: function (e) {
        var i, n = 0, s = 0, o = this;
        this.$slides.each(function () {
          i = this.getBoundingClientRect().height, t(this).attr("data-slide", s), o.$slides.filter(".is-active")[0] !== o.$slides.eq(s)[0] && t(this).css({
            position: "relative",
            display: "none"
          }), n = i > n ? i : n, s++
        }), s === this.$slides.length && (this.$wrapper.css({ height: n }), e && e(n))
      }
    }, {
      key: "_setSlideHeight", value: function (e) {
        this.$slides.each(function () {
          t(this).css("max-height", e)
        })
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        if (this.$element.off(".resizeme.zf.trigger").on({ "resizeme.zf.trigger": this._prepareForOrbit.bind(this) }), this.$slides.length > 1) {
          if (this.options.swipe && this.$slides.off("swipeleft.zf.orbit swiperight.zf.orbit").on("swipeleft.zf.orbit", function (t) {
              t.preventDefault(), e.changeSlide(!0)
            }).on("swiperight.zf.orbit", function (t) {
              t.preventDefault(), e.changeSlide(!1)
            }), this.options.autoPlay && (this.$slides.on("click.zf.orbit", function () {
              e.$element.data("clickedOn", !e.$element.data("clickedOn")), e.timer[e.$element.data("clickedOn") ? "pause" : "start"]()
            }), this.options.pauseOnHover && this.$element.on("mouseenter.zf.orbit", function () {
              e.timer.pause()
            }).on("mouseleave.zf.orbit", function () {
              e.$element.data("clickedOn") || e.timer.start()
            })), this.options.navButtons) {
            var i = this.$element.find("." + this.options.nextClass + ", ." + this.options.prevClass);
            i.attr("tabindex", 0).on("click.zf.orbit touchend.zf.orbit", function (i) {
              i.preventDefault(), e.changeSlide(t(this).hasClass(e.options.nextClass))
            })
          }
          this.options.bullets && this.$bullets.on("click.zf.orbit touchend.zf.orbit", function () {
            if (/is-active/g.test(this.className))return !1;
            var i = t(this).data("slide"), n = i > e.$slides.filter(".is-active").data("slide"), s = e.$slides.eq(i);
            e.changeSlide(n, s, i)
          }), this.options.accessible && this.$wrapper.add(this.$bullets).on("keydown.zf.orbit", function (i) {
            Foundation.Keyboard.handleKey(i, "Orbit", {
              next: function () {
                e.changeSlide(!0)
              }, previous: function () {
                e.changeSlide(!1)
              }, handled: function () {
                t(i.target).is(e.$bullets) && e.$bullets.filter(".is-active").focus()
              }
            })
          })
        }
      }
    }, {
      key: "_reset", value: function () {
        "undefined" != typeof this.$slides && this.$slides.length > 1 && (this.$element.off(".zf.orbit").find("*").off(".zf.orbit"), this.options.autoPlay && this.timer.restart(), this.$slides.each(function (e) {
          t(e).removeClass("is-active is-active is-in").removeAttr("aria-live").hide()
        }), this.$slides.first().addClass("is-active").show(), this.$element.trigger("slidechange.zf.orbit", [this.$slides.first()]), this.options.bullets && this._updateBullets(0))
      }
    }, {
      key: "changeSlide", value: function (t, e, i) {
        if (this.$slides) {
          var n = this.$slides.filter(".is-active").eq(0);
          if (/mui/g.test(n[0].className))return !1;
          var s, o = this.$slides.first(), r = this.$slides.last(), a = t ? "Right" : "Left", l = t ? "Left" : "Right", u = this;
          s = e ? e : t ? this.options.infiniteWrap ? n.next("." + this.options.slideClass).length ? n.next("." + this.options.slideClass) : o : n.next("." + this.options.slideClass) : this.options.infiniteWrap ? n.prev("." + this.options.slideClass).length ? n.prev("." + this.options.slideClass) : r : n.prev("." + this.options.slideClass), s.length && (this.$element.trigger("beforeslidechange.zf.orbit", [n, s]), this.options.bullets && (i = i || this.$slides.index(s), this._updateBullets(i)), this.options.useMUI && !this.$element.is(":hidden") ? (Foundation.Motion.animateIn(s.addClass("is-active").css({
              position: "absolute",
              top: 0
            }), this.options["animInFrom" + a], function () {
              s.css({ position: "relative", display: "block" }).attr("aria-live", "polite")
            }), Foundation.Motion.animateOut(n.removeClass("is-active"), this.options["animOutTo" + l], function () {
              n.removeAttr("aria-live"), u.options.autoPlay && !u.timer.isPaused && u.timer.restart()
            })) : (n.removeClass("is-active is-in").removeAttr("aria-live").hide(), s.addClass("is-active is-in").attr("aria-live", "polite").show(), this.options.autoPlay && !this.timer.isPaused && this.timer.restart()), this.$element.trigger("slidechange.zf.orbit", [s]))
        }
      }
    }, {
      key: "_updateBullets", value: function (t) {
        var e = this.$element.find("." + this.options.boxOfBullets).find(".is-active").removeClass("is-active").blur(), i = e.find("span:last").detach();
        this.$bullets.eq(t).addClass("is-active").append(i)
      }
    }, {
      key: "destroy", value: function () {
        this.$element.off(".zf.orbit").find("*").off(".zf.orbit").end().hide(), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    bullets: !0,
    navButtons: !0,
    animInFromRight: "slide-in-right",
    animOutToRight: "slide-out-right",
    animInFromLeft: "slide-in-left",
    animOutToLeft: "slide-out-left",
    autoPlay: !0,
    timerDelay: 5e3,
    infiniteWrap: !0,
    swipe: !0,
    pauseOnHover: !0,
    accessible: !0,
    containerClass: "orbit-container",
    slideClass: "orbit-slide",
    boxOfBullets: "orbit-bullets",
    nextClass: "orbit-next",
    prevClass: "orbit-previous",
    useMUI: !0
  }, Foundation.plugin(e, "Orbit")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = t(i), this.rules = this.$element.data("responsive-menu"), this.currentMq = null, this.currentPlugin = null, this._init(), this._events(), Foundation.registerPlugin(this, "ResponsiveMenu")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        if ("string" == typeof this.rules) {
          for (var e = {}, n = this.rules.split(" "), s = 0; s < n.length; s++) {
            var o = n[s].split("-"), r = o.length > 1 ? o[0] : "small", a = o.length > 1 ? o[1] : o[0];
            null !== i[a] && (e[r] = i[a])
          }
          this.rules = e
        }
        t.isEmptyObject(this.rules) || this._checkMediaQueries(), this.$element.attr("data-mutate", this.$element.attr("data-mutate") || Foundation.GetYoDigits(6, "responsive-menu"))
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        t(window).on("changed.zf.mediaquery", function () {
          e._checkMediaQueries()
        })
      }
    }, {
      key: "_checkMediaQueries", value: function () {
        var e, n = this;
        t.each(this.rules, function (t) {
          Foundation.MediaQuery.atLeast(t) && (e = t)
        }), e && (this.currentPlugin instanceof this.rules[e].plugin || (t.each(i, function (t, e) {
          n.$element.removeClass(e.cssClass)
        }), this.$element.addClass(this.rules[e].cssClass), this.currentPlugin && this.currentPlugin.destroy(), this.currentPlugin = new this.rules[e].plugin(this.$element, {})))
      }
    }, {
      key: "destroy", value: function () {
        this.currentPlugin.destroy(), t(window).off(".zf.ResponsiveMenu"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {};
  var i = {
    dropdown: { cssClass: "dropdown", plugin: Foundation._plugins["dropdown-menu"] || null },
    drilldown: { cssClass: "drilldown", plugin: Foundation._plugins.drilldown || null },
    accordion: { cssClass: "accordion-menu", plugin: Foundation._plugins["accordion-menu"] || null }
  };
  Foundation.plugin(e, "ResponsiveMenu")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = t(i), this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), this._events(), Foundation.registerPlugin(this, "ResponsiveToggle")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element.data("responsive-toggle");
        if (e || console.error("Your tab bar needs an ID of a Menu as the value of data-tab-bar."), this.$targetMenu = t("#" + e), this.$toggler = this.$element.find("[data-toggle]"), this.options = t.extend({}, this.options, this.$targetMenu.data()), this.options.animate) {
          var i = this.options.animate.split(" ");
          this.animationIn = i[0], this.animationOut = i[1] || null
        }
        this._update()
      }
    }, {
      key: "_events", value: function () {
        this._updateMqHandler = this._update.bind(this), t(window).on("changed.zf.mediaquery", this._updateMqHandler), this.$toggler.on("click.zf.responsiveToggle", this.toggleMenu.bind(this))
      }
    }, {
      key: "_update", value: function () {
        Foundation.MediaQuery.atLeast(this.options.hideFor) ? (this.$element.hide(), this.$targetMenu.show()) : (this.$element.show(), this.$targetMenu.hide())
      }
    }, {
      key: "toggleMenu", value: function () {
        var t = this;
        Foundation.MediaQuery.atLeast(this.options.hideFor) || (this.options.animate ? this.$targetMenu.is(":hidden") ? Foundation.Motion.animateIn(this.$targetMenu, this.animationIn, function () {
              t.$element.trigger("toggled.zf.responsiveToggle"), t.$targetMenu.find("[data-mutate]").triggerHandler("mutateme.zf.trigger")
            }) : Foundation.Motion.animateOut(this.$targetMenu, this.animationOut, function () {
              t.$element.trigger("toggled.zf.responsiveToggle")
            }) : (this.$targetMenu.toggle(0), this.$targetMenu.find("[data-mutate]").trigger("mutateme.zf.trigger"), this.$element.trigger("toggled.zf.responsiveToggle")))
      }
    }, {
      key: "destroy", value: function () {
        this.$element.off(".zf.responsiveToggle"), this.$toggler.off(".zf.responsiveToggle"), t(window).off("changed.zf.mediaquery", this._updateMqHandler), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = { hideFor: "medium", animate: !1 }, Foundation.plugin(e, "ResponsiveToggle")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  function e() {
    return /iP(ad|hone|od).*OS/.test(window.navigator.userAgent)
  }

  function i() {
    return /Android/.test(window.navigator.userAgent)
  }

  function n() {
    return e() || i()
  }

  var s = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Reveal"), Foundation.Keyboard.register("Reveal", {
        ENTER: "open",
        SPACE: "open",
        ESCAPE: "close"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        this.id = this.$element.attr("id"), this.isActive = !1, this.cached = { mq: Foundation.MediaQuery.current }, this.isMobile = n(), this.$anchor = t(t('[data-open="' + this.id + '"]').length ? '[data-open="' + this.id + '"]' : '[data-toggle="' + this.id + '"]'), this.$anchor.attr({
          "aria-controls": this.id,
          "aria-haspopup": !0,
          tabindex: 0
        }), (this.options.fullScreen || this.$element.hasClass("full")) && (this.options.fullScreen = !0, this.options.overlay = !1), this.options.overlay && !this.$overlay && (this.$overlay = this._makeOverlay(this.id)), this.$element.attr({
          role: "dialog",
          "aria-hidden": !0,
          "data-yeti-box": this.id,
          "data-resize": this.id
        }), this.$overlay ? this.$element.detach().appendTo(this.$overlay) : (this.$element.detach().appendTo(t(this.options.appendTo)), this.$element.addClass("without-overlay")), this._events(), this.options.deepLink && window.location.hash === "#" + this.id && t(window).one("load.zf.reveal", this.open.bind(this))
      }
    }, {
      key: "_makeOverlay", value: function () {
        return t("<div></div>").addClass("reveal-overlay").appendTo(this.options.appendTo)
      }
    }, {
      key: "_updatePosition", value: function () {
        var e, i, n = this.$element.outerWidth(), s = t(window).width(), o = this.$element.outerHeight(), r = t(window).height();
        e = "auto" === this.options.hOffset ? parseInt((s - n) / 2, 10) : parseInt(this.options.hOffset, 10), i = "auto" === this.options.vOffset ? o > r ? parseInt(Math.min(100, r / 10), 10) : parseInt((r - o) / 4, 10) : parseInt(this.options.vOffset, 10), this.$element.css({ top: i + "px" }), this.$overlay && "auto" === this.options.hOffset || (this.$element.css({ left: e + "px" }), this.$element.css({ margin: "0px" }))
      }
    }, {
      key: "_events", value: function () {
        var e = this, i = this;
        this.$element.on({
          "open.zf.trigger": this.open.bind(this), "close.zf.trigger": function (n, s) {
            if (n.target === i.$element[0] || t(n.target).parents("[data-closable]")[0] === s)return e.close.apply(e)
          }, "toggle.zf.trigger": this.toggle.bind(this), "resizeme.zf.trigger": function () {
            i._updatePosition()
          }
        }), this.$anchor.length && this.$anchor.on("keydown.zf.reveal", function (t) {
          13 !== t.which && 32 !== t.which || (t.stopPropagation(), t.preventDefault(), i.open())
        }), this.options.closeOnClick && this.options.overlay && this.$overlay.off(".zf.reveal").on("click.zf.reveal", function (e) {
          e.target !== i.$element[0] && !t.contains(i.$element[0], e.target) && t.contains(document, e.target) && i.close()
        }), this.options.deepLink && t(window).on("popstate.zf.reveal:" + this.id, this._handleState.bind(this))
      }
    }, {
      key: "_handleState", value: function (t) {
        window.location.hash !== "#" + this.id || this.isActive ? this.close() : this.open()
      }
    }, {
      key: "open", value: function () {
        function e() {
          s.isMobile ? (s.originalScrollPos || (s.originalScrollPos = window.pageYOffset), t("html, body").addClass("is-reveal-open")) : t("body").addClass("is-reveal-open")
        }

        var i = this;
        if (this.options.deepLink) {
          var n = "#" + this.id;
          window.history.pushState ? window.history.pushState(null, null, n) : window.location.hash = n
        }
        this.isActive = !0, this.$element.css({ visibility: "hidden" }).show().scrollTop(0), this.options.overlay && this.$overlay.css({ visibility: "hidden" }).show(), this._updatePosition(), this.$element.hide().css({ visibility: "" }), this.$overlay && (this.$overlay.css({ visibility: "" }).hide(), this.$element.hasClass("fast") ? this.$overlay.addClass("fast") : this.$element.hasClass("slow") && this.$overlay.addClass("slow")), this.options.multipleOpened || this.$element.trigger("closeme.zf.reveal", this.id);
        var s = this;
        this.options.animationIn ? !function () {
            var t = function () {
              s.$element.attr({
                "aria-hidden": !1,
                tabindex: -1
              }).focus(), e(), Foundation.Keyboard.trapFocus(s.$element)
            };
            i.options.overlay && Foundation.Motion.animateIn(i.$overlay, "fade-in"), Foundation.Motion.animateIn(i.$element, i.options.animationIn, function () {
              i.$element && (i.focusableElements = Foundation.Keyboard.findFocusable(i.$element), t())
            })
          }() : (this.options.overlay && this.$overlay.show(0), this.$element.show(this.options.showDelay)), this.$element.attr({
          "aria-hidden": !1,
          tabindex: -1
        }).focus(), Foundation.Keyboard.trapFocus(this.$element), this.$element.trigger("open.zf.reveal"), e(), setTimeout(function () {
          i._extraHandlers()
        }, 0)
      }
    }, {
      key: "_extraHandlers", value: function () {
        var e = this;
        this.$element && (this.focusableElements = Foundation.Keyboard.findFocusable(this.$element), this.options.overlay || !this.options.closeOnClick || this.options.fullScreen || t("body").on("click.zf.reveal", function (i) {
          i.target !== e.$element[0] && !t.contains(e.$element[0], i.target) && t.contains(document, i.target) && e.close()
        }), this.options.closeOnEsc && t(window).on("keydown.zf.reveal", function (t) {
          Foundation.Keyboard.handleKey(t, "Reveal", {
            close: function () {
              e.options.closeOnEsc && (e.close(), e.$anchor.focus())
            }
          })
        }), this.$element.on("keydown.zf.reveal", function (i) {
          var n = t(this);
          Foundation.Keyboard.handleKey(i, "Reveal", {
            open: function () {
              e.$element.find(":focus").is(e.$element.find("[data-close]")) ? setTimeout(function () {
                  e.$anchor.focus()
                }, 1) : n.is(e.focusableElements) && e.open()
            }, close: function () {
              e.options.closeOnEsc && (e.close(), e.$anchor.focus())
            }, handled: function (t) {
              t && i.preventDefault()
            }
          })
        }))
      }
    }, {
      key: "close", value: function () {
        function e() {
          i.isMobile ? (t("html, body").removeClass("is-reveal-open"), i.originalScrollPos && (t("body").scrollTop(i.originalScrollPos), i.originalScrollPos = null)) : t("body").removeClass("is-reveal-open"), Foundation.Keyboard.releaseFocus(i.$element), i.$element.attr("aria-hidden", !0), i.$element.trigger("closed.zf.reveal")
        }

        if (!this.isActive || !this.$element.is(":visible"))return !1;
        var i = this;
        this.options.animationOut ? (this.options.overlay ? Foundation.Motion.animateOut(this.$overlay, "fade-out", e) : e(), Foundation.Motion.animateOut(this.$element, this.options.animationOut)) : (this.options.overlay ? this.$overlay.hide(0, e) : e(), this.$element.hide(this.options.hideDelay)), this.options.closeOnEsc && t(window).off("keydown.zf.reveal"), !this.options.overlay && this.options.closeOnClick && t("body").off("click.zf.reveal"), this.$element.off("keydown.zf.reveal"), this.options.resetOnClose && this.$element.html(this.$element.html()), this.isActive = !1, i.options.deepLink && (window.history.replaceState ? window.history.replaceState("", document.title, window.location.href.replace("#" + this.id, "")) : window.location.hash = "")
      }
    }, {
      key: "toggle", value: function () {
        this.isActive ? this.close() : this.open()
      }
    }, {
      key: "destroy", value: function () {
        this.options.overlay && (this.$element.appendTo(t(this.options.appendTo)), this.$overlay.hide().off().remove()), this.$element.hide().off(), this.$anchor.off(".zf"), t(window).off(".zf.reveal:" + this.id), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  s.defaults = {
    animationIn: "",
    animationOut: "",
    showDelay: 0,
    hideDelay: 0,
    closeOnClick: !0,
    closeOnEsc: !0,
    multipleOpened: !1,
    vOffset: "auto",
    hOffset: "auto",
    fullScreen: !1,
    btmOffsetPct: 10,
    overlay: !0,
    resetOnClose: !1,
    deepLink: !1,
    appendTo: "body"
  }, Foundation.plugin(s, "Reveal")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  function e(t, e) {
    return t / e
  }

  function i(t, e, i, n) {
    return Math.abs(t.position()[e] + t[n]() / 2 - i)
  }

  function n(t, e) {
    return Math.log(e) / Math.log(t)
  }

  var s = function () {
    function s(e, i) {
      _classCallCheck(this, s), this.$element = e, this.options = t.extend({}, s.defaults, this.$element.data(), i), this._init(), Foundation.registerPlugin(this, "Slider"), Foundation.Keyboard.register("Slider", {
        ltr: {
          ARROW_RIGHT: "increase",
          ARROW_UP: "increase",
          ARROW_DOWN: "decrease",
          ARROW_LEFT: "decrease",
          SHIFT_ARROW_RIGHT: "increase_fast",
          SHIFT_ARROW_UP: "increase_fast",
          SHIFT_ARROW_DOWN: "decrease_fast",
          SHIFT_ARROW_LEFT: "decrease_fast"
        },
        rtl: {
          ARROW_LEFT: "increase",
          ARROW_RIGHT: "decrease",
          SHIFT_ARROW_LEFT: "increase_fast",
          SHIFT_ARROW_RIGHT: "decrease_fast"
        }
      })
    }

    return _createClass(s, [{
      key: "_init", value: function () {
        this.inputs = this.$element.find("input"), this.handles = this.$element.find("[data-slider-handle]"), this.$handle = this.handles.eq(0), this.$input = this.inputs.length ? this.inputs.eq(0) : t("#" + this.$handle.attr("aria-controls")), this.$fill = this.$element.find("[data-slider-fill]").css(this.options.vertical ? "height" : "width", 0);
        var e = !1;
        (this.options.disabled || this.$element.hasClass(this.options.disabledClass)) && (this.options.disabled = !0, this.$element.addClass(this.options.disabledClass)), this.inputs.length || (this.inputs = t().add(this.$input), this.options.binding = !0), this._setInitAttr(0), this.handles[1] && (this.options.doubleSided = !0, this.$handle2 = this.handles.eq(1), this.$input2 = this.inputs.length > 1 ? this.inputs.eq(1) : t("#" + this.$handle2.attr("aria-controls")), this.inputs[1] || (this.inputs = this.inputs.add(this.$input2)), e = !0, this._setInitAttr(1)), this.setHandles(), this._events()
      }
    }, {
      key: "setHandles", value: function () {
        var t = this;
        this.handles[1] ? this._setHandlePos(this.$handle, this.inputs.eq(0).val(), !0, function () {
            t._setHandlePos(t.$handle2, t.inputs.eq(1).val(), !0)
          }) : this._setHandlePos(this.$handle, this.inputs.eq(0).val(), !0)
      }
    }, {
      key: "_reflow", value: function () {
        this.setHandles()
      }
    }, {
      key: "_pctOfBar", value: function (t) {
        var i = e(t - this.options.start, this.options.end - this.options.start);
        switch (this.options.positionValueFunction) {
          case"pow":
            i = this._logTransform(i);
            break;
          case"log":
            i = this._powTransform(i)
        }
        return i.toFixed(2)
      }
    }, {
      key: "_value", value: function (t) {
        switch (this.options.positionValueFunction) {
          case"pow":
            t = this._powTransform(t);
            break;
          case"log":
            t = this._logTransform(t)
        }
        var e = (this.options.end - this.options.start) * t + this.options.start;
        return e
      }
    }, {
      key: "_logTransform", value: function (t) {
        return n(this.options.nonLinearBase, t * (this.options.nonLinearBase - 1) + 1)
      }
    }, {
      key: "_powTransform", value: function (t) {
        return (Math.pow(this.options.nonLinearBase, t) - 1) / (this.options.nonLinearBase - 1)
      }
    }, {
      key: "_setHandlePos", value: function (t, i, n, s) {
        if (!this.$element.hasClass(this.options.disabledClass)) {
          i = parseFloat(i), i < this.options.start ? i = this.options.start : i > this.options.end && (i = this.options.end);
          var o = this.options.doubleSided;
          if (o)if (0 === this.handles.index(t)) {
            var r = parseFloat(this.$handle2.attr("aria-valuenow"));
            i = i >= r ? r - this.options.step : i
          } else {
            var a = parseFloat(this.$handle.attr("aria-valuenow"));
            i = i <= a ? a + this.options.step : i
          }
          this.options.vertical && !n && (i = this.options.end - i);
          var l = this, u = this.options.vertical, d = u ? "height" : "width", c = u ? "top" : "left", h = t[0].getBoundingClientRect()[d], f = this.$element[0].getBoundingClientRect()[d], p = this._pctOfBar(i), g = (f - h) * p, m = (100 * e(g, f)).toFixed(this.options.decimal);
          i = parseFloat(i.toFixed(this.options.decimal));
          var v = {};
          if (this._setValues(t, i), o) {
            var y, b = 0 === this.handles.index(t), w = ~~(100 * e(h, f));
            if (b) v[c] = m + "%", y = parseFloat(this.$handle2[0].style[c]) - m + w, s && "function" == typeof s && s(); else {
              var C = parseFloat(this.$handle[0].style[c]);
              y = m - (isNaN(C) ? (this.options.initialStart - this.options.start) / ((this.options.end - this.options.start) / 100) : C) + w
            }
            v["min-" + d] = y + "%"
          }
          this.$element.one("finished.zf.animate", function () {
            l.$element.trigger("moved.zf.slider", [t])
          });
          var k = this.$element.data("dragging") ? 1e3 / 60 : this.options.moveTime;
          Foundation.Move(k, t, function () {
            isNaN(m) ? t.css(c, 100 * p + "%") : t.css(c, m + "%"), l.options.doubleSided ? l.$fill.css(v) : l.$fill.css(d, 100 * p + "%")
          }), clearTimeout(l.timeout), l.timeout = setTimeout(function () {
            l.$element.trigger("changed.zf.slider", [t])
          }, l.options.changedDelay)
        }
      }
    }, {
      key: "_setInitAttr", value: function (t) {
        var e = 0 === t ? this.options.initialStart : this.options.initialEnd, i = this.inputs.eq(t).attr("id") || Foundation.GetYoDigits(6, "slider");
        this.inputs.eq(t).attr({
          id: i,
          max: this.options.end,
          min: this.options.start,
          step: this.options.step
        }), this.inputs.eq(t).val(e), this.handles.eq(t).attr({
          role: "slider",
          "aria-controls": i,
          "aria-valuemax": this.options.end,
          "aria-valuemin": this.options.start,
          "aria-valuenow": e,
          "aria-orientation": this.options.vertical ? "vertical" : "horizontal",
          tabindex: 0
        })
      }
    }, {
      key: "_setValues", value: function (t, e) {
        var i = this.options.doubleSided ? this.handles.index(t) : 0;
        this.inputs.eq(i).val(e), t.attr("aria-valuenow", e)
      }
    }, {
      key: "_handleEvent", value: function (n, s, o) {
        var r, a;
        if (o) r = this._adjustValue(null, o),
          a = !0; else {
          n.preventDefault();
          var l = this, u = this.options.vertical, d = u ? "height" : "width", c = u ? "top" : "left", h = u ? n.pageY : n.pageX, f = (this.$handle[0].getBoundingClientRect()[d] / 2, this.$element[0].getBoundingClientRect()[d]), p = u ? t(window).scrollTop() : t(window).scrollLeft(), g = this.$element.offset()[c];
          n.clientY === n.pageY && (h += p);
          var m, v = h - g;
          m = v < 0 ? 0 : v > f ? f : v;
          var y = e(m, f);
          if (r = this._value(y), Foundation.rtl() && !this.options.vertical && (r = this.options.end - r), r = l._adjustValue(null, r), a = !1, !s) {
            var b = i(this.$handle, c, m, d), w = i(this.$handle2, c, m, d);
            s = b <= w ? this.$handle : this.$handle2
          }
        }
        this._setHandlePos(s, r, a)
      }
    }, {
      key: "_adjustValue", value: function (t, e) {
        var i, n, s, o, r = this.options.step, a = parseFloat(r / 2);
        return i = t ? parseFloat(t.attr("aria-valuenow")) : e, n = i % r, s = i - n, o = s + r, 0 === n ? i : i = i >= s + a ? o : s
      }
    }, {
      key: "_events", value: function () {
        this._eventsForHandle(this.$handle), this.handles[1] && this._eventsForHandle(this.$handle2)
      }
    }, {
      key: "_eventsForHandle", value: function (e) {
        var i, n = this;
        if (this.inputs.off("change.zf.slider").on("change.zf.slider", function (e) {
            var i = n.inputs.index(t(this));
            n._handleEvent(e, n.handles.eq(i), t(this).val())
          }), this.options.clickSelect && this.$element.off("click.zf.slider").on("click.zf.slider", function (e) {
            return !n.$element.data("dragging") && void(t(e.target).is("[data-slider-handle]") || (n.options.doubleSided ? n._handleEvent(e) : n._handleEvent(e, n.$handle)))
          }), this.options.draggable) {
          this.handles.addTouch();
          var s = t("body");
          e.off("mousedown.zf.slider").on("mousedown.zf.slider", function (o) {
            e.addClass("is-dragging"), n.$fill.addClass("is-dragging"), n.$element.data("dragging", !0), i = t(o.currentTarget), s.on("mousemove.zf.slider", function (t) {
              t.preventDefault(), n._handleEvent(t, i)
            }).on("mouseup.zf.slider", function (t) {
              n._handleEvent(t, i), e.removeClass("is-dragging"), n.$fill.removeClass("is-dragging"), n.$element.data("dragging", !1), s.off("mousemove.zf.slider mouseup.zf.slider")
            })
          }).on("selectstart.zf.slider touchmove.zf.slider", function (t) {
            t.preventDefault()
          })
        }
        e.off("keydown.zf.slider").on("keydown.zf.slider", function (e) {
          var i, s = t(this), o = n.options.doubleSided ? n.handles.index(s) : 0, r = parseFloat(n.inputs.eq(o).val());
          Foundation.Keyboard.handleKey(e, "Slider", {
            decrease: function () {
              i = r - n.options.step
            }, increase: function () {
              i = r + n.options.step
            }, decrease_fast: function () {
              i = r - 10 * n.options.step
            }, increase_fast: function () {
              i = r + 10 * n.options.step
            }, handled: function () {
              e.preventDefault(), n._setHandlePos(s, i, !0)
            }
          })
        })
      }
    }, {
      key: "destroy", value: function () {
        this.handles.off(".zf.slider"), this.inputs.off(".zf.slider"), this.$element.off(".zf.slider"), clearTimeout(this.timeout), Foundation.unregisterPlugin(this)
      }
    }]), s
  }();
  s.defaults = {
    start: 0,
    end: 100,
    step: 1,
    initialStart: 0,
    initialEnd: 100,
    binding: !1,
    clickSelect: !0,
    vertical: !1,
    draggable: !0,
    disabled: !1,
    doubleSided: !1,
    decimal: 2,
    moveTime: 200,
    disabledClass: "disabled",
    invertVertical: !1,
    changedDelay: 500,
    nonLinearBase: 5,
    positionValueFunction: "linear"
  }, Foundation.plugin(s, "Slider")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  function e(t) {
    return parseInt(window.getComputedStyle(document.body, null).fontSize, 10) * t
  }

  var i = function () {
    function i(e, n) {
      _classCallCheck(this, i), this.$element = e, this.options = t.extend({}, i.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Sticky")
    }

    return _createClass(i, [{
      key: "_init", value: function () {
        var e = this.$element.parent("[data-sticky-container]"), i = this.$element[0].id || Foundation.GetYoDigits(6, "sticky"), n = this;
        e.length || (this.wasWrapped = !0), this.$container = e.length ? e : t(this.options.container).wrapInner(this.$element), this.$container.addClass(this.options.containerClass), this.$element.addClass(this.options.stickyClass).attr({ "data-resize": i }), this.scrollCount = this.options.checkEvery, this.isStuck = !1, t(window).one("load.zf.sticky", function () {
          n.containerHeight = "none" == n.$element.css("display") ? 0 : n.$element[0].getBoundingClientRect().height, n.$container.css("height", n.containerHeight), n.elemHeight = n.containerHeight, "" !== n.options.anchor ? n.$anchor = t("#" + n.options.anchor) : n._parsePoints(), n._setSizes(function () {
            var t = window.pageYOffset;
            n._calc(!1, t), n.isStuck || n._removeSticky(!(t >= n.topPoint))
          }), n._events(i.split("-").reverse().join("-"))
        })
      }
    }, {
      key: "_parsePoints", value: function () {
        for (var e = "" == this.options.topAnchor ? 1 : this.options.topAnchor, i = "" == this.options.btmAnchor ? document.documentElement.scrollHeight : this.options.btmAnchor, n = [e, i], s = {}, o = 0, r = n.length; o < r && n[o]; o++) {
          var a;
          if ("number" == typeof n[o]) a = n[o]; else {
            var l = n[o].split(":"), u = t("#" + l[0]);
            a = u.offset().top, l[1] && "bottom" === l[1].toLowerCase() && (a += u[0].getBoundingClientRect().height)
          }
          s[o] = a
        }
        this.points = s
      }
    }, {
      key: "_events", value: function (e) {
        var i = this, n = this.scrollListener = "scroll.zf." + e;
        this.isOn || (this.canStick && (this.isOn = !0, t(window).off(n).on(n, function (t) {
          0 === i.scrollCount ? (i.scrollCount = i.options.checkEvery, i._setSizes(function () {
              i._calc(!1, window.pageYOffset)
            })) : (i.scrollCount--, i._calc(!1, window.pageYOffset))
        })), this.$element.off("resizeme.zf.trigger").on("resizeme.zf.trigger", function (t, s) {
          i._setSizes(function () {
            i._calc(!1), i.canStick ? i.isOn || i._events(e) : i.isOn && i._pauseListeners(n)
          })
        }))
      }
    }, {
      key: "_pauseListeners", value: function (e) {
        this.isOn = !1, t(window).off(e), this.$element.trigger("pause.zf.sticky")
      }
    }, {
      key: "_calc", value: function (t, e) {
        return t && this._setSizes(), this.canStick ? (e || (e = window.pageYOffset), void(e >= this.topPoint ? e <= this.bottomPoint ? this.isStuck || this._setSticky() : this.isStuck && this._removeSticky(!1) : this.isStuck && this._removeSticky(!0))) : (this.isStuck && this._removeSticky(!0), !1)
      }
    }, {
      key: "_setSticky", value: function () {
        var t = this, e = this.options.stickTo, i = "top" === e ? "marginTop" : "marginBottom", n = "top" === e ? "bottom" : "top", s = {};
        s[i] = this.options[i] + "em", s[e] = 0, s[n] = "auto", this.isStuck = !0, this.$element.removeClass("is-anchored is-at-" + n).addClass("is-stuck is-at-" + e).css(s).trigger("sticky.zf.stuckto:" + e), this.$element.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
          t._setSizes()
        })
      }
    }, {
      key: "_removeSticky", value: function (t) {
        var e = this.options.stickTo, i = "top" === e, n = {}, s = (this.points ? this.points[1] - this.points[0] : this.anchorHeight) - this.elemHeight, o = i ? "marginTop" : "marginBottom", r = t ? "top" : "bottom";
        n[o] = 0, n.bottom = "auto", t ? n.top = 0 : n.top = s, this.isStuck = !1, this.$element.removeClass("is-stuck is-at-" + e).addClass("is-anchored is-at-" + r).css(n).trigger("sticky.zf.unstuckfrom:" + r)
      }
    }, {
      key: "_setSizes", value: function (t) {
        this.canStick = Foundation.MediaQuery.is(this.options.stickyOn), this.canStick || t && "function" == typeof t && t();
        var e = this.$container[0].getBoundingClientRect().width, i = window.getComputedStyle(this.$container[0]), n = parseInt(i["padding-left"], 10), s = parseInt(i["padding-right"], 10);
        this.$anchor && this.$anchor.length ? this.anchorHeight = this.$anchor[0].getBoundingClientRect().height : this._parsePoints(), this.$element.css({ "max-width": e - n - s + "px" });
        var o = this.$element[0].getBoundingClientRect().height || this.containerHeight;
        if ("none" == this.$element.css("display") && (o = 0), this.containerHeight = o, this.$container.css({ height: o }), this.elemHeight = o, !this.isStuck && this.$element.hasClass("is-at-bottom")) {
          var r = (this.points ? this.points[1] - this.$container.offset().top : this.anchorHeight) - this.elemHeight;
          this.$element.css("top", r)
        }
        this._setBreakPoints(o, function () {
          t && "function" == typeof t && t()
        })
      }
    }, {
      key: "_setBreakPoints", value: function (t, i) {
        if (!this.canStick) {
          if (!i || "function" != typeof i)return !1;
          i()
        }
        var n = e(this.options.marginTop), s = e(this.options.marginBottom), o = this.points ? this.points[0] : this.$anchor.offset().top, r = this.points ? this.points[1] : o + this.anchorHeight, a = window.innerHeight;
        "top" === this.options.stickTo ? (o -= n, r -= t + n) : "bottom" === this.options.stickTo && (o -= a - (t + s), r -= a - s), this.topPoint = o, this.bottomPoint = r, i && "function" == typeof i && i()
      }
    }, {
      key: "destroy", value: function () {
        this._removeSticky(!0), this.$element.removeClass(this.options.stickyClass + " is-anchored is-at-top").css({
          height: "",
          top: "",
          bottom: "",
          "max-width": ""
        }).off("resizeme.zf.trigger"), this.$anchor && this.$anchor.length && this.$anchor.off("change.zf.sticky"), t(window).off(this.scrollListener), this.wasWrapped ? this.$element.unwrap() : this.$container.removeClass(this.options.containerClass).css({ height: "" }), Foundation.unregisterPlugin(this)
      }
    }]), i
  }();
  i.defaults = {
    container: "<div data-sticky-container></div>",
    stickTo: "top",
    anchor: "",
    topAnchor: "",
    btmAnchor: "",
    marginTop: 1,
    marginBottom: 1,
    stickyOn: "medium",
    stickyClass: "sticky",
    containerClass: "sticky-container",
    checkEvery: -1
  }, Foundation.plugin(i, "Sticky")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this._init(), Foundation.registerPlugin(this, "Tabs"), Foundation.Keyboard.register("Tabs", {
        ENTER: "open",
        SPACE: "open",
        ARROW_RIGHT: "next",
        ARROW_UP: "previous",
        ARROW_DOWN: "next",
        ARROW_LEFT: "previous"
      })
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this;
        if (this.$element.attr({ role: "tablist" }), this.$tabTitles = this.$element.find("." + this.options.linkClass), this.$tabContent = t('[data-tabs-content="' + this.$element[0].id + '"]'), this.$tabTitles.each(function () {
            var i = t(this), n = i.find("a"), s = i.hasClass("" + e.options.linkActiveClass), o = n[0].hash.slice(1), r = n[0].id ? n[0].id : o + "-label", a = t("#" + o);
            if (i.attr({ role: "presentation" }), n.attr({
                role: "tab",
                "aria-controls": o,
                "aria-selected": s,
                id: r
              }), a.attr({
                role: "tabpanel",
                "aria-hidden": !s,
                "aria-labelledby": r
              }), s && e.options.autoFocus && t(window).load(function () {
                t("html, body").animate({ scrollTop: i.offset().top }, e.options.deepLinkSmudgeDelay, function () {
                  n.focus()
                })
              }), e.options.deepLink) {
              var l = window.location.hash;
              if (l.length) {
                var n = i.find('[href="' + l + '"]');
                n.length && (e.selectTab(t(l)), e.options.deepLinkSmudge && t(window).load(function () {
                  var n = i.offset();
                  t("html, body").animate({ scrollTop: n.top }, e.options.deepLinkSmudgeDelay)
                }), i.trigger("deeplink.zf.tabs", [n, t(l)]))
              }
            }
          }), this.options.matchHeight) {
          var i = this.$tabContent.find("img");
          i.length ? Foundation.onImagesLoaded(i, this._setHeight.bind(this)) : this._setHeight()
        }
        this._events()
      }
    }, {
      key: "_events", value: function () {
        this._addKeyHandler(), this._addClickHandler(), this._setHeightMqHandler = null, this.options.matchHeight && (this._setHeightMqHandler = this._setHeight.bind(this), t(window).on("changed.zf.mediaquery", this._setHeightMqHandler))
      }
    }, {
      key: "_addClickHandler", value: function () {
        var e = this;
        this.$element.off("click.zf.tabs").on("click.zf.tabs", "." + this.options.linkClass, function (i) {
          i.preventDefault(), i.stopPropagation(), e._handleTabChange(t(this))
        })
      }
    }, {
      key: "_addKeyHandler", value: function () {
        var e = this;
        this.$tabTitles.off("keydown.zf.tabs").on("keydown.zf.tabs", function (i) {
          if (9 !== i.which) {
            var n, s, o = t(this), r = o.parent("ul").children("li");
            r.each(function (i) {
              if (t(this).is(o))return void(e.options.wrapOnKeys ? (n = 0 === i ? r.last() : r.eq(i - 1), s = i === r.length - 1 ? r.first() : r.eq(i + 1)) : (n = r.eq(Math.max(0, i - 1)), s = r.eq(Math.min(i + 1, r.length - 1))))
            }), Foundation.Keyboard.handleKey(i, "Tabs", {
              open: function () {
                o.find('[role="tab"]').focus(), e._handleTabChange(o)
              }, previous: function () {
                n.find('[role="tab"]').focus(), e._handleTabChange(n)
              }, next: function () {
                s.find('[role="tab"]').focus(), e._handleTabChange(s)
              }, handled: function () {
                i.stopPropagation(), i.preventDefault()
              }
            })
          }
        })
      }
    }, {
      key: "_handleTabChange", value: function (t) {
        if (t.hasClass("" + this.options.linkActiveClass))return void(this.options.activeCollapse && (this._collapseTab(t), this.$element.trigger("collapse.zf.tabs", [t])));
        var e = this.$element.find("." + this.options.linkClass + "." + this.options.linkActiveClass), i = t.find('[role="tab"]'), n = i[0].hash, s = this.$tabContent.find(n);
        if (this._collapseTab(e), this._openTab(t), this.options.deepLink) {
          var o = t.find("a").attr("href");
          this.options.updateHistory ? history.pushState({}, "", o) : history.replaceState({}, "", o)
        }
        this.$element.trigger("change.zf.tabs", [t, s]), s.find("[data-mutate]").trigger("mutateme.zf.trigger")
      }
    }, {
      key: "_openTab", value: function (t) {
        var e = t.find('[role="tab"]'), i = e[0].hash, n = this.$tabContent.find(i);
        t.addClass("" + this.options.linkActiveClass), e.attr({ "aria-selected": "true" }), n.addClass("" + this.options.panelActiveClass).attr({ "aria-hidden": "false" })
      }
    }, {
      key: "_collapseTab", value: function (e) {
        var i = e.removeClass("" + this.options.linkActiveClass).find('[role="tab"]').attr({ "aria-selected": "false" });
        t("#" + i.attr("aria-controls")).removeClass("" + this.options.panelActiveClass).attr({ "aria-hidden": "true" })
      }
    }, {
      key: "selectTab", value: function (t) {
        var e;
        e = "object" == typeof t ? t[0].id : t, e.indexOf("#") < 0 && (e = "#" + e);
        var i = this.$tabTitles.find('[href="' + e + '"]').parent("." + this.options.linkClass);
        this._handleTabChange(i)
      }
    }, {
      key: "_setHeight", value: function () {
        var e = 0;
        this.$tabContent.find("." + this.options.panelClass).css("height", "").each(function () {
          var i = t(this), n = i.hasClass("" + this.options.panelActiveClass);
          n || i.css({ visibility: "hidden", display: "block" });
          var s = this.getBoundingClientRect().height;
          n || i.css({ visibility: "", display: "" }), e = s > e ? s : e
        }).css("height", e + "px")
      }
    }, {
      key: "destroy", value: function () {
        this.$element.find("." + this.options.linkClass).off(".zf.tabs").hide().end().find("." + this.options.panelClass).hide(), this.options.matchHeight && null != this._setHeightMqHandler && t(window).off("changed.zf.mediaquery", this._setHeightMqHandler), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    deepLink: !1,
    deepLinkSmudge: !1,
    deepLinkSmudgeDelay: 300,
    updateHistory: !1,
    autoFocus: !1,
    wrapOnKeys: !0,
    matchHeight: !1,
    activeCollapse: !1,
    linkClass: "tabs-title",
    linkActiveClass: "is-active",
    panelClass: "tabs-panel",
    panelActiveClass: "is-active"
  }, Foundation.plugin(e, "Tabs")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, i.data(), n), this.className = "", this._init(), this._events(), Foundation.registerPlugin(this, "Toggler")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e;
        this.options.animate ? (e = this.options.animate.split(" "), this.animationIn = e[0], this.animationOut = e[1] || null) : (e = this.$element.data("toggler"), this.className = "." === e[0] ? e.slice(1) : e);
        var i = this.$element[0].id;
        t('[data-open="' + i + '"], [data-close="' + i + '"], [data-toggle="' + i + '"]').attr("aria-controls", i), this.$element.attr("aria-expanded", !this.$element.is(":hidden"))
      }
    }, {
      key: "_events", value: function () {
        this.$element.off("toggle.zf.trigger").on("toggle.zf.trigger", this.toggle.bind(this))
      }
    }, {
      key: "toggle", value: function () {
        this[this.options.animate ? "_toggleAnimate" : "_toggleClass"]()
      }
    }, {
      key: "_toggleClass", value: function () {
        this.$element.toggleClass(this.className);
        var t = this.$element.hasClass(this.className);
        t ? this.$element.trigger("on.zf.toggler") : this.$element.trigger("off.zf.toggler"), this._updateARIA(t), this.$element.find("[data-mutate]").trigger("mutateme.zf.trigger")
      }
    }, {
      key: "_toggleAnimate", value: function () {
        var t = this;
        this.$element.is(":hidden") ? Foundation.Motion.animateIn(this.$element, this.animationIn, function () {
            t._updateARIA(!0), this.trigger("on.zf.toggler"), this.find("[data-mutate]").trigger("mutateme.zf.trigger")
          }) : Foundation.Motion.animateOut(this.$element, this.animationOut, function () {
            t._updateARIA(!1), this.trigger("off.zf.toggler"), this.find("[data-mutate]").trigger("mutateme.zf.trigger")
          })
      }
    }, {
      key: "_updateARIA", value: function (t) {
        this.$element.attr("aria-expanded", !!t)
      }
    }, {
      key: "destroy", value: function () {
        this.$element.off(".zf.toggler"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = { animate: !1 }, Foundation.plugin(e, "Toggler")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = i, this.options = t.extend({}, e.defaults, this.$element.data(), n), this.isActive = !1, this.isClick = !1, this._init(), Foundation.registerPlugin(this, "Tooltip")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        var e = this.$element.attr("aria-describedby") || Foundation.GetYoDigits(6, "tooltip");
        this.options.positionClass = this.options.positionClass || this._getPositionClass(this.$element), this.options.tipText = this.options.tipText || this.$element.attr("title"), this.template = this.options.template ? t(this.options.template) : this._buildTemplate(e), this.options.allowHtml ? this.template.appendTo(document.body).html(this.options.tipText).hide() : this.template.appendTo(document.body).text(this.options.tipText).hide(), this.$element.attr({
          title: "",
          "aria-describedby": e,
          "data-yeti-box": e,
          "data-toggle": e,
          "data-resize": e
        }).addClass(this.options.triggerClass), this.usedPositions = [], this.counter = 4, this.classChanged = !1, this._events()
      }
    }, {
      key: "_getPositionClass", value: function (t) {
        if (!t)return "";
        var e = t[0].className.match(/\b(top|left|right)\b/g);
        return e = e ? e[0] : ""
      }
    }, {
      key: "_buildTemplate", value: function (e) {
        var i = (this.options.tooltipClass + " " + this.options.positionClass + " " + this.options.templateClasses).trim(), n = t("<div></div>").addClass(i).attr({
          role: "tooltip",
          "aria-hidden": !0,
          "data-is-active": !1,
          "data-is-focus": !1,
          id: e
        });
        return n
      }
    }, {
      key: "_reposition", value: function (t) {
        this.usedPositions.push(t ? t : "bottom"), !t && this.usedPositions.indexOf("top") < 0 ? this.template.addClass("top") : "top" === t && this.usedPositions.indexOf("bottom") < 0 ? this.template.removeClass(t) : "left" === t && this.usedPositions.indexOf("right") < 0 ? this.template.removeClass(t).addClass("right") : "right" === t && this.usedPositions.indexOf("left") < 0 ? this.template.removeClass(t).addClass("left") : !t && this.usedPositions.indexOf("top") > -1 && this.usedPositions.indexOf("left") < 0 ? this.template.addClass("left") : "top" === t && this.usedPositions.indexOf("bottom") > -1 && this.usedPositions.indexOf("left") < 0 ? this.template.removeClass(t).addClass("left") : "left" === t && this.usedPositions.indexOf("right") > -1 && this.usedPositions.indexOf("bottom") < 0 ? this.template.removeClass(t) : "right" === t && this.usedPositions.indexOf("left") > -1 && this.usedPositions.indexOf("bottom") < 0 ? this.template.removeClass(t) : this.template.removeClass(t), this.classChanged = !0, this.counter--
      }
    }, {
      key: "_setPosition", value: function () {
        var t = this._getPositionClass(this.template), e = Foundation.Box.GetDimensions(this.template), i = Foundation.Box.GetDimensions(this.$element), n = "left" === t ? "left" : "right" === t ? "left" : "top", s = "top" === n ? "height" : "width";
        "height" === s ? this.options.vOffset : this.options.hOffset;
        if (e.width >= e.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.template))return this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, "center bottom", this.options.vOffset, this.options.hOffset, !0)).css({
          width: i.windowDims.width - 2 * this.options.hOffset,
          height: "auto"
        }), !1;
        for (this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, "center " + (t || "bottom"), this.options.vOffset, this.options.hOffset)); !Foundation.Box.ImNotTouchingYou(this.template) && this.counter;)this._reposition(t), this._setPosition()
      }
    }, {
      key: "show", value: function () {
        if ("all" !== this.options.showOn && !Foundation.MediaQuery.is(this.options.showOn))return !1;
        var t = this;
        this.template.css("visibility", "hidden").show(), this._setPosition(), this.$element.trigger("closeme.zf.tooltip", this.template.attr("id")), this.template.attr({
          "data-is-active": !0,
          "aria-hidden": !1
        }), t.isActive = !0, this.template.stop().hide().css("visibility", "").fadeIn(this.options.fadeInDuration, function () {
        }), this.$element.trigger("show.zf.tooltip")
      }
    }, {
      key: "hide", value: function () {
        var t = this;
        this.template.stop().attr({
          "aria-hidden": !0,
          "data-is-active": !1
        }).fadeOut(this.options.fadeOutDuration, function () {
          t.isActive = !1, t.isClick = !1, t.classChanged && (t.template.removeClass(t._getPositionClass(t.template)).addClass(t.options.positionClass), t.usedPositions = [], t.counter = 4, t.classChanged = !1)
        }), this.$element.trigger("hide.zf.tooltip")
      }
    }, {
      key: "_events", value: function () {
        var t = this, e = (this.template, !1);
        this.options.disableHover || this.$element.on("mouseenter.zf.tooltip", function (e) {
          t.isActive || (t.timeout = setTimeout(function () {
            t.show()
          }, t.options.hoverDelay))
        }).on("mouseleave.zf.tooltip", function (i) {
          clearTimeout(t.timeout), (!e || t.isClick && !t.options.clickOpen) && t.hide()
        }), this.options.clickOpen ? this.$element.on("mousedown.zf.tooltip", function (e) {
            e.stopImmediatePropagation(), t.isClick || (t.isClick = !0, !t.options.disableHover && t.$element.attr("tabindex") || t.isActive || t.show())
          }) : this.$element.on("mousedown.zf.tooltip", function (e) {
            e.stopImmediatePropagation(), t.isClick = !0
          }), this.options.disableForTouch || this.$element.on("tap.zf.tooltip touchend.zf.tooltip", function (e) {
          t.isActive ? t.hide() : t.show()
        }), this.$element.on({ "close.zf.trigger": this.hide.bind(this) }), this.$element.on("focus.zf.tooltip", function (i) {
          return e = !0, t.isClick ? (t.options.clickOpen || (e = !1), !1) : void t.show()
        }).on("focusout.zf.tooltip", function (i) {
          e = !1, t.isClick = !1, t.hide()
        }).on("resizeme.zf.trigger", function () {
          t.isActive && t._setPosition()
        })
      }
    }, {
      key: "toggle", value: function () {
        this.isActive ? this.hide() : this.show()
      }
    }, {
      key: "destroy", value: function () {
        this.$element.attr("title", this.template.text()).off(".zf.trigger .zf.tooltip").removeClass("has-tip top right left").removeAttr("aria-describedby aria-haspopup data-disable-hover data-resize data-toggle data-tooltip data-yeti-box"), this.template.remove(), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {
    disableForTouch: !1,
    hoverDelay: 200,
    fadeInDuration: 150,
    fadeOutDuration: 150,
    disableHover: !1,
    templateClasses: "",
    tooltipClass: "tooltip",
    triggerClass: "has-tip",
    showOn: "small",
    template: "",
    tipText: "",
    touchCloseText: "Tap to close.",
    clickOpen: !0,
    positionClass: "",
    vOffset: 10,
    hOffset: 12,
    allowHtml: !1
  }, Foundation.plugin(e, "Tooltip")
}(jQuery);
var _createClass = function () {
  function t(t, e) {
    for (var i = 0; i < e.length; i++) {
      var n = e[i];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
    }
  }

  return function (e, i, n) {
    return i && t(e.prototype, i), n && t(e, n), e
  }
}();
!function (t) {
  var e = function () {
    function e(i, n) {
      _classCallCheck(this, e), this.$element = t(i), this.options = t.extend({}, this.$element.data(), n), this.rules = this.$element.data("responsive-accordion-tabs"), this.currentMq = null, this.currentPlugin = null, this.$element.attr("id") || this.$element.attr("id", Foundation.GetYoDigits(6, "responsiveaccordiontabs")), this._init(), this._events(), Foundation.registerPlugin(this, "ResponsiveAccordionTabs")
    }

    return _createClass(e, [{
      key: "_init", value: function () {
        if ("string" == typeof this.rules) {
          for (var e = {}, n = this.rules.split(" "), s = 0; s < n.length; s++) {
            var o = n[s].split("-"), r = o.length > 1 ? o[0] : "small", a = o.length > 1 ? o[1] : o[0];
            null !== i[a] && (e[r] = i[a])
          }
          this.rules = e
        }
        this._getAllOptions(), t.isEmptyObject(this.rules) || this._checkMediaQueries()
      }
    }, {
      key: "_getAllOptions", value: function () {
        var e = this;
        e.allOptions = {};
        for (var n in i)if (i.hasOwnProperty(n)) {
          var s = i[n];
          try {
            var o = t("<ul></ul>"), r = new s.plugin(o, e.options);
            for (var a in r.options)if (r.options.hasOwnProperty(a) && "zfPlugin" !== a) {
              var l = r.options[a];
              e.allOptions[a] = l
            }
            r.destroy()
          } catch (u) {
          }
        }
      }
    }, {
      key: "_events", value: function () {
        var e = this;
        t(window).on("changed.zf.mediaquery", function () {
          e._checkMediaQueries()
        })
      }
    }, {
      key: "_checkMediaQueries", value: function () {
        var e, n = this;
        t.each(this.rules, function (t) {
          Foundation.MediaQuery.atLeast(t) && (e = t)
        }), e && (this.currentPlugin instanceof this.rules[e].plugin || (t.each(i, function (t, e) {
          n.$element.removeClass(e.cssClass)
        }), this.$element.addClass(this.rules[e].cssClass), this.currentPlugin && (!this.currentPlugin.$element.data("zfPlugin") && this.storezfData && this.currentPlugin.$element.data("zfPlugin", this.storezfData), this.currentPlugin.destroy()), this._handleMarkup(this.rules[e].cssClass), this.currentPlugin = new this.rules[e].plugin(this.$element, {}), this.storezfData = this.currentPlugin.$element.data("zfPlugin")))
      }
    }, {
      key: "_handleMarkup", value: function (e) {
        var i = this, n = "accordion", s = t("[data-tabs-content=" + this.$element.attr("id") + "]");
        if (s.length && (n = "tabs"), n !== e) {
          var o = i.allOptions.linkClass ? i.allOptions.linkClass : "tabs-title", r = i.allOptions.panelClass ? i.allOptions.panelClass : "tabs-panel";
          this.$element.removeAttr("role");
          var a = this.$element.children("." + o + ",[data-accordion-item]").removeClass(o).removeClass("accordion-item").removeAttr("data-accordion-item"), l = a.children("a").removeClass("accordion-title");
          if ("tabs" === n ? (s = s.children("." + r).removeClass(r).removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby"), s.children("a").removeAttr("role").removeAttr("aria-controls").removeAttr("aria-selected")) : s = a.children("[data-tab-content]").removeClass("accordion-content"), s.css({
              display: "",
              visibility: ""
            }), a.css({ display: "", visibility: "" }), "accordion" === e) s.each(function (e, n) {
            t(n).appendTo(a.get(e)).addClass("accordion-content").attr("data-tab-content", "").removeClass("is-active").css({ height: "" }), t("[data-tabs-content=" + i.$element.attr("id") + "]").after('<div id="tabs-placeholder-' + i.$element.attr("id") + '"></div>').remove(), a.addClass("accordion-item").attr("data-accordion-item", ""), l.addClass("accordion-title")
          }); else if ("tabs" === e) {
            var u = t("[data-tabs-content=" + i.$element.attr("id") + "]"), d = t("#tabs-placeholder-" + i.$element.attr("id"));
            d.length ? (u = t('<div class="tabs-content"></div>').insertAfter(d).attr("data-tabs-content", i.$element.attr("id")), d.remove()) : u = t('<div class="tabs-content"></div>').insertAfter(i.$element).attr("data-tabs-content", i.$element.attr("id")), s.each(function (e, i) {
              var n = t(i).appendTo(u).addClass(r), s = l.get(e).hash.slice(1), o = t(i).attr("id") || Foundation.GetYoDigits(6, "accordion");
              s !== o && ("" !== s ? t(i).attr("id", s) : (s = o, t(i).attr("id", s), t(l.get(e)).attr("href", t(l.get(e)).attr("href").replace("#", "") + "#" + s)));
              var d = t(a.get(e)).hasClass("is-active");
              d && n.addClass("is-active")
            }), a.addClass(o)
          }
        }
      }
    }, {
      key: "destroy", value: function () {
        this.currentPlugin && this.currentPlugin.destroy(), t(window).off(".zf.ResponsiveAccordionTabs"), Foundation.unregisterPlugin(this)
      }
    }]), e
  }();
  e.defaults = {};
  var i = {
    tabs: { cssClass: "tabs", plugin: Foundation._plugins.tabs || null },
    accordion: { cssClass: "accordion", plugin: Foundation._plugins.accordion || null }
  };
  Foundation.plugin(e, "ResponsiveAccordionTabs")
}(jQuery), function (t) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], t) : "undefined" != typeof exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function (t) {
  "use strict";
  var e = window.Slick || {};
  e = function () {
    function e(e, n) {
      var s, o = this;
      o.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: t(e),
        appendDots: t(e),
        arrows: !0,
        asNavFor: null,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (e, i) {
          return t('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1)
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: .35,
        fade: !1,
        focusOnSelect: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3
      }, o.initials = {
        animating: !1,
        dragging: !1,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: !1,
        slideOffset: 0,
        swipeLeft: null,
        $list: null,
        touchObject: {},
        transformsEnabled: !1,
        unslicked: !1
      }, t.extend(o, o.initials), o.activeBreakpoint = null, o.animType = null, o.animProp = null, o.breakpoints = [], o.breakpointSettings = [], o.cssTransitions = !1, o.focussed = !1, o.interrupted = !1, o.hidden = "hidden", o.paused = !0, o.positionProp = null, o.respondTo = null, o.rowCount = 1, o.shouldClick = !0, o.$slider = t(e), o.$slidesCache = null, o.transformType = null, o.transitionType = null, o.visibilityChange = "visibilitychange", o.windowWidth = 0, o.windowTimer = null, s = t(e).data("slick") || {}, o.options = t.extend({}, o.defaults, n, s), o.currentSlide = o.options.initialSlide, o.originalSettings = o.options, "undefined" != typeof document.mozHidden ? (o.hidden = "mozHidden", o.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (o.hidden = "webkitHidden", o.visibilityChange = "webkitvisibilitychange"), o.autoPlay = t.proxy(o.autoPlay, o), o.autoPlayClear = t.proxy(o.autoPlayClear, o), o.autoPlayIterator = t.proxy(o.autoPlayIterator, o), o.changeSlide = t.proxy(o.changeSlide, o), o.clickHandler = t.proxy(o.clickHandler, o), o.selectHandler = t.proxy(o.selectHandler, o), o.setPosition = t.proxy(o.setPosition, o), o.swipeHandler = t.proxy(o.swipeHandler, o), o.dragHandler = t.proxy(o.dragHandler, o), o.keyHandler = t.proxy(o.keyHandler, o), o.instanceUid = i++, o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, o.registerBreakpoints(), o.init(!0)
    }

    var i = 0;
    return e
  }(), e.prototype.activateADA = function () {
    var t = this;
    t.$slideTrack.find(".slick-active").attr({ "aria-hidden": "false" }).find("a, input, button, select").attr({ tabindex: "0" })
  }, e.prototype.addSlide = e.prototype.slickAdd = function (e, i, n) {
    var s = this;
    if ("boolean" == typeof i) n = i, i = null; else if (i < 0 || i >= s.slideCount)return !1;
    s.unload(), "number" == typeof i ? 0 === i && 0 === s.$slides.length ? t(e).appendTo(s.$slideTrack) : n ? t(e).insertBefore(s.$slides.eq(i)) : t(e).insertAfter(s.$slides.eq(i)) : n === !0 ? t(e).prependTo(s.$slideTrack) : t(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, i) {
      t(i).attr("data-slick-index", e)
    }), s.$slidesCache = s.$slides, s.reinit()
  }, e.prototype.animateHeight = function () {
    var t = this;
    if (1 === t.options.slidesToShow && t.options.adaptiveHeight === !0 && t.options.vertical === !1) {
      var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
      t.$list.animate({ height: e }, t.options.speed)
    }
  }, e.prototype.animateSlide = function (e, i) {
    var n = {}, s = this;
    s.animateHeight(), s.options.rtl === !0 && s.options.vertical === !1 && (e = -e), s.transformsEnabled === !1 ? s.options.vertical === !1 ? s.$slideTrack.animate({ left: e }, s.options.speed, s.options.easing, i) : s.$slideTrack.animate({ top: e }, s.options.speed, s.options.easing, i) : s.cssTransitions === !1 ? (s.options.rtl === !0 && (s.currentLeft = -s.currentLeft), t({ animStart: s.currentLeft }).animate({ animStart: e }, {
          duration: s.options.speed,
          easing: s.options.easing,
          step: function (t) {
            t = Math.ceil(t), s.options.vertical === !1 ? (n[s.animType] = "translate(" + t + "px, 0px)", s.$slideTrack.css(n)) : (n[s.animType] = "translate(0px," + t + "px)", s.$slideTrack.css(n))
          },
          complete: function () {
            i && i.call()
          }
        })) : (s.applyTransition(), e = Math.ceil(e), s.options.vertical === !1 ? n[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : n[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(n), i && setTimeout(function () {
          s.disableTransition(), i.call()
        }, s.options.speed))
  }, e.prototype.getNavTarget = function () {
    var e = this, i = e.options.asNavFor;
    return i && null !== i && (i = t(i).not(e.$slider)), i
  }, e.prototype.asNavFor = function (e) {
    var i = this, n = i.getNavTarget();
    null !== n && "object" == typeof n && n.each(function () {
      var i = t(this).slick("getSlick");
      i.unslicked || i.slideHandler(e, !0)
    })
  }, e.prototype.applyTransition = function (t) {
    var e = this, i = {};
    e.options.fade === !1 ? i[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : i[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase,
      e.options.fade === !1 ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i)
  }, e.prototype.autoPlay = function () {
    var t = this;
    t.autoPlayClear(), t.slideCount > t.options.slidesToShow && (t.autoPlayTimer = setInterval(t.autoPlayIterator, t.options.autoplaySpeed))
  }, e.prototype.autoPlayClear = function () {
    var t = this;
    t.autoPlayTimer && clearInterval(t.autoPlayTimer)
  }, e.prototype.autoPlayIterator = function () {
    var t = this, e = t.currentSlide + t.options.slidesToScroll;
    t.paused || t.interrupted || t.focussed || (t.options.infinite === !1 && (1 === t.direction && t.currentSlide + 1 === t.slideCount - 1 ? t.direction = 0 : 0 === t.direction && (e = t.currentSlide - t.options.slidesToScroll, t.currentSlide - 1 === 0 && (t.direction = 1))), t.slideHandler(e))
  }, e.prototype.buildArrows = function () {
    var e = this;
    e.options.arrows === !0 && (e.$prevArrow = t(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = t(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), e.options.infinite !== !0 && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
        "aria-disabled": "true",
        tabindex: "-1"
      }))
  }, e.prototype.buildDots = function () {
    var e, i, n = this;
    if (n.options.dots === !0 && n.slideCount > n.options.slidesToShow) {
      for (n.$slider.addClass("slick-dotted"), i = t("<ul />").addClass(n.options.dotsClass), e = 0; e <= n.getDotCount(); e += 1)i.append(t("<li />").append(n.options.customPaging.call(this, n, e)));
      n.$dots = i.appendTo(n.options.appendDots), n.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
    }
  }, e.prototype.buildOut = function () {
    var e = this;
    e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, i) {
      t(i).attr("data-slick-index", e).data("originalStyling", t(i).attr("style") || "")
    }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? t('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), e.options.centerMode !== !0 && e.options.swipeToSlide !== !0 || (e.options.slidesToScroll = 1), t("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.options.draggable === !0 && e.$list.addClass("draggable")
  }, e.prototype.buildRows = function () {
    var t, e, i, n, s, o, r, a = this;
    if (n = document.createDocumentFragment(), o = a.$slider.children(), a.options.rows > 1) {
      for (r = a.options.slidesPerRow * a.options.rows, s = Math.ceil(o.length / r), t = 0; t < s; t++) {
        var l = document.createElement("div");
        for (e = 0; e < a.options.rows; e++) {
          var u = document.createElement("div");
          for (i = 0; i < a.options.slidesPerRow; i++) {
            var d = t * r + (e * a.options.slidesPerRow + i);
            o.get(d) && u.appendChild(o.get(d))
          }
          l.appendChild(u)
        }
        n.appendChild(l)
      }
      a.$slider.empty().append(n), a.$slider.children().children().children().css({
        width: 100 / a.options.slidesPerRow + "%",
        display: "inline-block"
      })
    }
  }, e.prototype.checkResponsive = function (e, i) {
    var n, s, o, r = this, a = !1, l = r.$slider.width(), u = window.innerWidth || t(window).width();
    if ("window" === r.respondTo ? o = u : "slider" === r.respondTo ? o = l : "min" === r.respondTo && (o = Math.min(u, l)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
      s = null;
      for (n in r.breakpoints)r.breakpoints.hasOwnProperty(n) && (r.originalSettings.mobileFirst === !1 ? o < r.breakpoints[n] && (s = r.breakpoints[n]) : o > r.breakpoints[n] && (s = r.breakpoints[n]));
      null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || i) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = t.extend({}, r.originalSettings, r.breakpointSettings[s]), e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e)), a = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = t.extend({}, r.originalSettings, r.breakpointSettings[s]), e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e)), a = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, e === !0 && (r.currentSlide = r.options.initialSlide), r.refresh(e), a = s), e || a === !1 || r.$slider.trigger("breakpoint", [r, a])
    }
  }, e.prototype.changeSlide = function (e, i) {
    var n, s, o, r = this, a = t(e.currentTarget);
    switch (a.is("a") && e.preventDefault(), a.is("li") || (a = a.closest("li")), o = r.slideCount % r.options.slidesToScroll !== 0, n = o ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
      case"previous":
        s = 0 === n ? r.options.slidesToScroll : r.options.slidesToShow - n, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, i);
        break;
      case"next":
        s = 0 === n ? r.options.slidesToScroll : n, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, i);
        break;
      case"index":
        var l = 0 === e.data.index ? 0 : e.data.index || a.index() * r.options.slidesToScroll;
        r.slideHandler(r.checkNavigable(l), !1, i), a.children().trigger("focus");
        break;
      default:
        return
    }
  }, e.prototype.checkNavigable = function (t) {
    var e, i, n = this;
    if (e = n.getNavigableIndexes(), i = 0, t > e[e.length - 1]) t = e[e.length - 1]; else for (var s in e) {
      if (t < e[s]) {
        t = i;
        break
      }
      i = e[s]
    }
    return t
  }, e.prototype.cleanUpEvents = function () {
    var e = this;
    e.options.dots && null !== e.$dots && t("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", t.proxy(e.interrupt, e, !0)).off("mouseleave.slick", t.proxy(e.interrupt, e, !1)), e.$slider.off("focus.slick blur.slick"), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide)), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), t(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), e.options.accessibility === !0 && e.$list.off("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().off("click.slick", e.selectHandler), t(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), t(window).off("resize.slick.slick-" + e.instanceUid, e.resize), t("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), t(window).off("load.slick.slick-" + e.instanceUid, e.setPosition), t(document).off("ready.slick.slick-" + e.instanceUid, e.setPosition)
  }, e.prototype.cleanUpSlideEvents = function () {
    var e = this;
    e.$list.off("mouseenter.slick", t.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", t.proxy(e.interrupt, e, !1))
  }, e.prototype.cleanUpRows = function () {
    var t, e = this;
    e.options.rows > 1 && (t = e.$slides.children().children(), t.removeAttr("style"), e.$slider.empty().append(t))
  }, e.prototype.clickHandler = function (t) {
    var e = this;
    e.shouldClick === !1 && (t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault())
  }, e.prototype.destroy = function (e) {
    var i = this;
    i.autoPlayClear(), i.touchObject = {}, i.cleanUpEvents(), t(".slick-cloned", i.$slider).detach(), i.$dots && i.$dots.remove(), i.$prevArrow && i.$prevArrow.length && (i.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.prevArrow) && i.$prevArrow.remove()), i.$nextArrow && i.$nextArrow.length && (i.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), i.htmlExpr.test(i.options.nextArrow) && i.$nextArrow.remove()), i.$slides && (i.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
      t(this).attr("style", t(this).data("originalStyling"))
    }), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.detach(), i.$list.detach(), i.$slider.append(i.$slides)), i.cleanUpRows(), i.$slider.removeClass("slick-slider"), i.$slider.removeClass("slick-initialized"), i.$slider.removeClass("slick-dotted"), i.unslicked = !0, e || i.$slider.trigger("destroy", [i])
  }, e.prototype.disableTransition = function (t) {
    var e = this, i = {};
    i[e.transitionType] = "", e.options.fade === !1 ? e.$slideTrack.css(i) : e.$slides.eq(t).css(i)
  }, e.prototype.fadeSlide = function (t, e) {
    var i = this;
    i.cssTransitions === !1 ? (i.$slides.eq(t).css({ zIndex: i.options.zIndex }), i.$slides.eq(t).animate({ opacity: 1 }, i.options.speed, i.options.easing, e)) : (i.applyTransition(t), i.$slides.eq(t).css({
        opacity: 1,
        zIndex: i.options.zIndex
      }), e && setTimeout(function () {
        i.disableTransition(t), e.call()
      }, i.options.speed))
  }, e.prototype.fadeSlideOut = function (t) {
    var e = this;
    e.cssTransitions === !1 ? e.$slides.eq(t).animate({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }, e.options.speed, e.options.easing) : (e.applyTransition(t), e.$slides.eq(t).css({
        opacity: 0,
        zIndex: e.options.zIndex - 2
      }))
  }, e.prototype.filterSlides = e.prototype.slickFilter = function (t) {
    var e = this;
    null !== t && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(t).appendTo(e.$slideTrack), e.reinit())
  }, e.prototype.focusHandler = function () {
    var e = this;
    e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function (i) {
      i.stopImmediatePropagation();
      var n = t(this);
      setTimeout(function () {
        e.options.pauseOnFocus && (e.focussed = n.is(":focus"), e.autoPlay())
      }, 0)
    })
  }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
    var t = this;
    return t.currentSlide
  }, e.prototype.getDotCount = function () {
    var t = this, e = 0, i = 0, n = 0;
    if (t.options.infinite === !0)for (; e < t.slideCount;)++n, e = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow; else if (t.options.centerMode === !0) n = t.slideCount; else if (t.options.asNavFor)for (; e < t.slideCount;)++n, e = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow; else n = 1 + Math.ceil((t.slideCount - t.options.slidesToShow) / t.options.slidesToScroll);
    return n - 1
  }, e.prototype.getLeft = function (t) {
    var e, i, n, s = this, o = 0;
    return s.slideOffset = 0, i = s.$slides.first().outerHeight(!0), s.options.infinite === !0 ? (s.slideCount > s.options.slidesToShow && (s.slideOffset = s.slideWidth * s.options.slidesToShow * -1, o = i * s.options.slidesToShow * -1), s.slideCount % s.options.slidesToScroll !== 0 && t + s.options.slidesToScroll > s.slideCount && s.slideCount > s.options.slidesToShow && (t > s.slideCount ? (s.slideOffset = (s.options.slidesToShow - (t - s.slideCount)) * s.slideWidth * -1, o = (s.options.slidesToShow - (t - s.slideCount)) * i * -1) : (s.slideOffset = s.slideCount % s.options.slidesToScroll * s.slideWidth * -1, o = s.slideCount % s.options.slidesToScroll * i * -1))) : t + s.options.slidesToShow > s.slideCount && (s.slideOffset = (t + s.options.slidesToShow - s.slideCount) * s.slideWidth, o = (t + s.options.slidesToShow - s.slideCount) * i), s.slideCount <= s.options.slidesToShow && (s.slideOffset = 0, o = 0), s.options.centerMode === !0 && s.options.infinite === !0 ? s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2) - s.slideWidth : s.options.centerMode === !0 && (s.slideOffset = 0, s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2)), e = s.options.vertical === !1 ? t * s.slideWidth * -1 + s.slideOffset : t * i * -1 + o, s.options.variableWidth === !0 && (n = s.slideCount <= s.options.slidesToShow || s.options.infinite === !1 ? s.$slideTrack.children(".slick-slide").eq(t) : s.$slideTrack.children(".slick-slide").eq(t + s.options.slidesToShow), e = s.options.rtl === !0 ? n[0] ? (s.$slideTrack.width() - n[0].offsetLeft - n.width()) * -1 : 0 : n[0] ? n[0].offsetLeft * -1 : 0, s.options.centerMode === !0 && (n = s.slideCount <= s.options.slidesToShow || s.options.infinite === !1 ? s.$slideTrack.children(".slick-slide").eq(t) : s.$slideTrack.children(".slick-slide").eq(t + s.options.slidesToShow + 1), e = s.options.rtl === !0 ? n[0] ? (s.$slideTrack.width() - n[0].offsetLeft - n.width()) * -1 : 0 : n[0] ? n[0].offsetLeft * -1 : 0, e += (s.$list.width() - n.outerWidth()) / 2)), e
  }, e.prototype.getOption = e.prototype.slickGetOption = function (t) {
    var e = this;
    return e.options[t]
  }, e.prototype.getNavigableIndexes = function () {
    var t, e = this, i = 0, n = 0, s = [];
    for (e.options.infinite === !1 ? t = e.slideCount : (i = e.options.slidesToScroll * -1, n = e.options.slidesToScroll * -1, t = 2 * e.slideCount); i < t;)s.push(i), i = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
    return s
  }, e.prototype.getSlick = function () {
    return this
  }, e.prototype.getSlideCount = function () {
    var e, i, n, s = this;
    return n = s.options.centerMode === !0 ? s.slideWidth * Math.floor(s.options.slidesToShow / 2) : 0, s.options.swipeToSlide === !0 ? (s.$slideTrack.find(".slick-slide").each(function (e, o) {
        if (o.offsetLeft - n + t(o).outerWidth() / 2 > s.swipeLeft * -1)return i = o, !1
      }), e = Math.abs(t(i).attr("data-slick-index") - s.currentSlide) || 1) : s.options.slidesToScroll
  }, e.prototype.goTo = e.prototype.slickGoTo = function (t, e) {
    var i = this;
    i.changeSlide({ data: { message: "index", index: parseInt(t) } }, e)
  }, e.prototype.init = function (e) {
    var i = this;
    t(i.$slider).hasClass("slick-initialized") || (t(i.$slider).addClass("slick-initialized"), i.buildRows(), i.buildOut(), i.setProps(), i.startLoad(), i.loadSlider(), i.initializeEvents(), i.updateArrows(), i.updateDots(), i.checkResponsive(!0), i.focusHandler()), e && i.$slider.trigger("init", [i]), i.options.accessibility === !0 && i.initADA(), i.options.autoplay && (i.paused = !1, i.autoPlay())
  }, e.prototype.initADA = function () {
    var e = this;
    e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      tabindex: "-1"
    }).find("a, input, button, select").attr({ tabindex: "-1" }), e.$slideTrack.attr("role", "listbox"), e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (i) {
      t(this).attr({ role: "option", "aria-describedby": "slick-slide" + e.instanceUid + i })
    }), null !== e.$dots && e.$dots.attr("role", "tablist").find("li").each(function (i) {
      t(this).attr({
        role: "presentation",
        "aria-selected": "false",
        "aria-controls": "navigation" + e.instanceUid + i,
        id: "slick-slide" + e.instanceUid + i
      })
    }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), e.activateADA()
  }, e.prototype.initArrowEvents = function () {
    var t = this;
    t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.off("click.slick").on("click.slick", { message: "previous" }, t.changeSlide), t.$nextArrow.off("click.slick").on("click.slick", { message: "next" }, t.changeSlide))
  }, e.prototype.initDotEvents = function () {
    var e = this;
    e.options.dots === !0 && e.slideCount > e.options.slidesToShow && t("li", e.$dots).on("click.slick", { message: "index" }, e.changeSlide), e.options.dots === !0 && e.options.pauseOnDotsHover === !0 && t("li", e.$dots).on("mouseenter.slick", t.proxy(e.interrupt, e, !0)).on("mouseleave.slick", t.proxy(e.interrupt, e, !1))
  }, e.prototype.initSlideEvents = function () {
    var e = this;
    e.options.pauseOnHover && (e.$list.on("mouseenter.slick", t.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", t.proxy(e.interrupt, e, !1)))
  }, e.prototype.initializeEvents = function () {
    var e = this;
    e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", { action: "start" }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", { action: "move" }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", { action: "end" }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", { action: "end" }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), t(document).on(e.visibilityChange, t.proxy(e.visibility, e)), e.options.accessibility === !0 && e.$list.on("keydown.slick", e.keyHandler), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().on("click.slick", e.selectHandler), t(window).on("orientationchange.slick.slick-" + e.instanceUid, t.proxy(e.orientationChange, e)), t(window).on("resize.slick.slick-" + e.instanceUid, t.proxy(e.resize, e)), t("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), t(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), t(document).on("ready.slick.slick-" + e.instanceUid, e.setPosition)
  }, e.prototype.initUI = function () {
    var t = this;
    t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.show(), t.$nextArrow.show()), t.options.dots === !0 && t.slideCount > t.options.slidesToShow && t.$dots.show()
  }, e.prototype.keyHandler = function (t) {
    var e = this;
    t.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === t.keyCode && e.options.accessibility === !0 ? e.changeSlide({ data: { message: e.options.rtl === !0 ? "next" : "previous" } }) : 39 === t.keyCode && e.options.accessibility === !0 && e.changeSlide({ data: { message: e.options.rtl === !0 ? "previous" : "next" } }))
  }, e.prototype.lazyLoad = function () {
    function e(e) {
      t("img[data-lazy]", e).each(function () {
        var e = t(this), i = t(this).attr("data-lazy"), n = document.createElement("img");
        n.onload = function () {
          e.animate({ opacity: 0 }, 100, function () {
            e.attr("src", i).animate({ opacity: 1 }, 200, function () {
              e.removeAttr("data-lazy").removeClass("slick-loading")
            }), r.$slider.trigger("lazyLoaded", [r, e, i])
          })
        }, n.onerror = function () {
          e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, e, i])
        }, n.src = i
      })
    }

    var i, n, s, o, r = this;
    r.options.centerMode === !0 ? r.options.infinite === !0 ? (s = r.currentSlide + (r.options.slidesToShow / 2 + 1), o = s + r.options.slidesToShow + 2) : (s = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)), o = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide) : (s = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide, o = Math.ceil(s + r.options.slidesToShow), r.options.fade === !0 && (s > 0 && s--, o <= r.slideCount && o++)), i = r.$slider.find(".slick-slide").slice(s, o), e(i), r.slideCount <= r.options.slidesToShow ? (n = r.$slider.find(".slick-slide"), e(n)) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? (n = r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow), e(n)) : 0 === r.currentSlide && (n = r.$slider.find(".slick-cloned").slice(r.options.slidesToShow * -1), e(n))
  }, e.prototype.loadSlider = function () {
    var t = this;
    t.setPosition(), t.$slideTrack.css({ opacity: 1 }), t.$slider.removeClass("slick-loading"), t.initUI(), "progressive" === t.options.lazyLoad && t.progressiveLazyLoad()
  }, e.prototype.next = e.prototype.slickNext = function () {
    var t = this;
    t.changeSlide({ data: { message: "next" } })
  }, e.prototype.orientationChange = function () {
    var t = this;
    t.checkResponsive(), t.setPosition()
  }, e.prototype.pause = e.prototype.slickPause = function () {
    var t = this;
    t.autoPlayClear(), t.paused = !0
  }, e.prototype.play = e.prototype.slickPlay = function () {
    var t = this;
    t.autoPlay(), t.options.autoplay = !0, t.paused = !1, t.focussed = !1, t.interrupted = !1
  }, e.prototype.postSlide = function (t) {
    var e = this;
    e.unslicked || (e.$slider.trigger("afterChange", [e, t]), e.animating = !1, e.setPosition(), e.swipeLeft = null, e.options.autoplay && e.autoPlay(), e.options.accessibility === !0 && e.initADA())
  }, e.prototype.prev = e.prototype.slickPrev = function () {
    var t = this;
    t.changeSlide({ data: { message: "previous" } })
  }, e.prototype.preventDefault = function (t) {
    t.preventDefault()
  }, e.prototype.progressiveLazyLoad = function (e) {
    e = e || 1;
    var i, n, s, o = this, r = t("img[data-lazy]", o.$slider);
    r.length ? (i = r.first(), n = i.attr("data-lazy"), s = document.createElement("img"), s.onload = function () {
        i.attr("src", n).removeAttr("data-lazy").removeClass("slick-loading"), o.options.adaptiveHeight === !0 && o.setPosition(), o.$slider.trigger("lazyLoaded", [o, i, n]), o.progressiveLazyLoad()
      }, s.onerror = function () {
        e < 3 ? setTimeout(function () {
            o.progressiveLazyLoad(e + 1)
          }, 500) : (i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), o.$slider.trigger("lazyLoadError", [o, i, n]), o.progressiveLazyLoad())
      }, s.src = n) : o.$slider.trigger("allImagesLoaded", [o])
  }, e.prototype.refresh = function (e) {
    var i, n, s = this;
    n = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > n && (s.currentSlide = n), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), i = s.currentSlide, s.destroy(!0), t.extend(s, s.initials, { currentSlide: i }), s.init(), e || s.changeSlide({
      data: {
        message: "index",
        index: i
      }
    }, !1)
  }, e.prototype.registerBreakpoints = function () {
    var e, i, n, s = this, o = s.options.responsive || null;
    if ("array" === t.type(o) && o.length) {
      s.respondTo = s.options.respondTo || "window";
      for (e in o)if (n = s.breakpoints.length - 1, i = o[e].breakpoint, o.hasOwnProperty(e)) {
        for (; n >= 0;)s.breakpoints[n] && s.breakpoints[n] === i && s.breakpoints.splice(n, 1), n--;
        s.breakpoints.push(i), s.breakpointSettings[i] = o[e].settings
      }
      s.breakpoints.sort(function (t, e) {
        return s.options.mobileFirst ? t - e : e - t
      })
    }
  }, e.prototype.reinit = function () {
    var e = this;
    e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), e.options.focusOnSelect === !0 && t(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e])
  }, e.prototype.resize = function () {
    var e = this;
    t(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
      e.windowWidth = t(window).width(), e.checkResponsive(), e.unslicked || e.setPosition()
    }, 50))
  }, e.prototype.removeSlide = e.prototype.slickRemove = function (t, e, i) {
    var n = this;
    return "boolean" == typeof t ? (e = t, t = e === !0 ? 0 : n.slideCount - 1) : t = e === !0 ? --t : t, !(n.slideCount < 1 || t < 0 || t > n.slideCount - 1) && (n.unload(), i === !0 ? n.$slideTrack.children().remove() : n.$slideTrack.children(this.options.slide).eq(t).remove(), n.$slides = n.$slideTrack.children(this.options.slide), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.append(n.$slides), n.$slidesCache = n.$slides, void n.reinit())
  }, e.prototype.setCSS = function (t) {
    var e, i, n = this, s = {};
    n.options.rtl === !0 && (t = -t), e = "left" == n.positionProp ? Math.ceil(t) + "px" : "0px", i = "top" == n.positionProp ? Math.ceil(t) + "px" : "0px", s[n.positionProp] = t, n.transformsEnabled === !1 ? n.$slideTrack.css(s) : (s = {}, n.cssTransitions === !1 ? (s[n.animType] = "translate(" + e + ", " + i + ")", n.$slideTrack.css(s)) : (s[n.animType] = "translate3d(" + e + ", " + i + ", 0px)", n.$slideTrack.css(s)))
  }, e.prototype.setDimensions = function () {
    var t = this;
    t.options.vertical === !1 ? t.options.centerMode === !0 && t.$list.css({ padding: "0px " + t.options.centerPadding }) : (t.$list.height(t.$slides.first().outerHeight(!0) * t.options.slidesToShow), t.options.centerMode === !0 && t.$list.css({ padding: t.options.centerPadding + " 0px" })), t.listWidth = t.$list.width(), t.listHeight = t.$list.height(), t.options.vertical === !1 && t.options.variableWidth === !1 ? (t.slideWidth = Math.ceil(t.listWidth / t.options.slidesToShow), t.$slideTrack.width(Math.ceil(t.slideWidth * t.$slideTrack.children(".slick-slide").length))) : t.options.variableWidth === !0 ? t.$slideTrack.width(5e3 * t.slideCount) : (t.slideWidth = Math.ceil(t.listWidth), t.$slideTrack.height(Math.ceil(t.$slides.first().outerHeight(!0) * t.$slideTrack.children(".slick-slide").length)));
    var e = t.$slides.first().outerWidth(!0) - t.$slides.first().width();
    t.options.variableWidth === !1 && t.$slideTrack.children(".slick-slide").width(t.slideWidth - e)
  }, e.prototype.setFade = function () {
    var e, i = this;
    i.$slides.each(function (n, s) {
      e = i.slideWidth * n * -1, i.options.rtl === !0 ? t(s).css({
          position: "relative",
          right: e,
          top: 0,
          zIndex: i.options.zIndex - 2,
          opacity: 0
        }) : t(s).css({ position: "relative", left: e, top: 0, zIndex: i.options.zIndex - 2, opacity: 0 })
    }), i.$slides.eq(i.currentSlide).css({ zIndex: i.options.zIndex - 1, opacity: 1 })
  }, e.prototype.setHeight = function () {
    var t = this;
    if (1 === t.options.slidesToShow && t.options.adaptiveHeight === !0 && t.options.vertical === !1) {
      var e = t.$slides.eq(t.currentSlide).outerHeight(!0);
      t.$list.css("height", e)
    }
  }, e.prototype.setOption = e.prototype.slickSetOption = function () {
    var e, i, n, s, o, r = this, a = !1;
    if ("object" === t.type(arguments[0]) ? (n = arguments[0], a = arguments[1], o = "multiple") : "string" === t.type(arguments[0]) && (n = arguments[0], s = arguments[1], a = arguments[2], "responsive" === arguments[0] && "array" === t.type(arguments[1]) ? o = "responsive" : "undefined" != typeof arguments[1] && (o = "single")), "single" === o) r.options[n] = s; else if ("multiple" === o) t.each(n, function (t, e) {
      r.options[t] = e
    }); else if ("responsive" === o)for (i in s)if ("array" !== t.type(r.options.responsive)) r.options.responsive = [s[i]]; else {
      for (e = r.options.responsive.length - 1; e >= 0;)r.options.responsive[e].breakpoint === s[i].breakpoint && r.options.responsive.splice(e, 1), e--;
      r.options.responsive.push(s[i])
    }
    a && (r.unload(), r.reinit())
  }, e.prototype.setPosition = function () {
    var t = this;
    t.setDimensions(), t.setHeight(), t.options.fade === !1 ? t.setCSS(t.getLeft(t.currentSlide)) : t.setFade(), t.$slider.trigger("setPosition", [t])
  }, e.prototype.setProps = function () {
    var t = this, e = document.body.style;
    t.positionProp = t.options.vertical === !0 ? "top" : "left", "top" === t.positionProp ? t.$slider.addClass("slick-vertical") : t.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || t.options.useCSS === !0 && (t.cssTransitions = !0), t.options.fade && ("number" == typeof t.options.zIndex ? t.options.zIndex < 3 && (t.options.zIndex = 3) : t.options.zIndex = t.defaults.zIndex), void 0 !== e.OTransform && (t.animType = "OTransform", t.transformType = "-o-transform", t.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (t.animType = !1)), void 0 !== e.MozTransform && (t.animType = "MozTransform", t.transformType = "-moz-transform", t.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (t.animType = !1)), void 0 !== e.webkitTransform && (t.animType = "webkitTransform", t.transformType = "-webkit-transform", t.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (t.animType = !1)), void 0 !== e.msTransform && (t.animType = "msTransform", t.transformType = "-ms-transform", t.transitionType = "msTransition", void 0 === e.msTransform && (t.animType = !1)), void 0 !== e.transform && t.animType !== !1 && (t.animType = "transform", t.transformType = "transform", t.transitionType = "transition"), t.transformsEnabled = t.options.useTransform && null !== t.animType && t.animType !== !1
  }, e.prototype.setSlideClasses = function (t) {
    var e, i, n, s, o = this;
    i = o.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), o.$slides.eq(t).addClass("slick-current"), o.options.centerMode === !0 ? (e = Math.floor(o.options.slidesToShow / 2), o.options.infinite === !0 && (t >= e && t <= o.slideCount - 1 - e ? o.$slides.slice(t - e, t + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (n = o.options.slidesToShow + t, i.slice(n - e + 1, n + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === t ? i.eq(i.length - 1 - o.options.slidesToShow).addClass("slick-center") : t === o.slideCount - 1 && i.eq(o.options.slidesToShow).addClass("slick-center")), o.$slides.eq(t).addClass("slick-center")) : t >= 0 && t <= o.slideCount - o.options.slidesToShow ? o.$slides.slice(t, t + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : i.length <= o.options.slidesToShow ? i.addClass("slick-active").attr("aria-hidden", "false") : (s = o.slideCount % o.options.slidesToShow, n = o.options.infinite === !0 ? o.options.slidesToShow + t : t, o.options.slidesToShow == o.options.slidesToScroll && o.slideCount - t < o.options.slidesToShow ? i.slice(n - (o.options.slidesToShow - s), n + s).addClass("slick-active").attr("aria-hidden", "false") : i.slice(n, n + o.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === o.options.lazyLoad && o.lazyLoad()
  }, e.prototype.setupInfinite = function () {
    var e, i, n, s = this;
    if (s.options.fade === !0 && (s.options.centerMode = !1), s.options.infinite === !0 && s.options.fade === !1 && (i = null, s.slideCount > s.options.slidesToShow)) {
      for (n = s.options.centerMode === !0 ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - n; e -= 1)i = e - 1, t(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
      for (e = 0; e < n; e += 1)i = e, t(s.$slides[i]).clone(!0).attr("id", "").attr("data-slick-index", i + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
      s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
        t(this).attr("id", "")
      })
    }
  }, e.prototype.interrupt = function (t) {
    var e = this;
    t || e.autoPlay(), e.interrupted = t
  }, e.prototype.selectHandler = function (e) {
    var i = this, n = t(e.target).is(".slick-slide") ? t(e.target) : t(e.target).parents(".slick-slide"), s = parseInt(n.attr("data-slick-index"));
    return s || (s = 0), i.slideCount <= i.options.slidesToShow ? (i.setSlideClasses(s), void i.asNavFor(s)) : void i.slideHandler(s)
  }, e.prototype.slideHandler = function (t, e, i) {
    var n, s, o, r, a, l = null, u = this;
    if (e = e || !1, (u.animating !== !0 || u.options.waitForAnimate !== !0) && !(u.options.fade === !0 && u.currentSlide === t || u.slideCount <= u.options.slidesToShow))return e === !1 && u.asNavFor(t), n = t, l = u.getLeft(n), r = u.getLeft(u.currentSlide), u.currentLeft = null === u.swipeLeft ? r : u.swipeLeft, u.options.infinite === !1 && u.options.centerMode === !1 && (t < 0 || t > u.getDotCount() * u.options.slidesToScroll) ? void(u.options.fade === !1 && (n = u.currentSlide, i !== !0 ? u.animateSlide(r, function () {
          u.postSlide(n)
        }) : u.postSlide(n))) : u.options.infinite === !1 && u.options.centerMode === !0 && (t < 0 || t > u.slideCount - u.options.slidesToScroll) ? void(u.options.fade === !1 && (n = u.currentSlide, i !== !0 ? u.animateSlide(r, function () {
            u.postSlide(n)
          }) : u.postSlide(n))) : (u.options.autoplay && clearInterval(u.autoPlayTimer), s = n < 0 ? u.slideCount % u.options.slidesToScroll !== 0 ? u.slideCount - u.slideCount % u.options.slidesToScroll : u.slideCount + n : n >= u.slideCount ? u.slideCount % u.options.slidesToScroll !== 0 ? 0 : n - u.slideCount : n, u.animating = !0, u.$slider.trigger("beforeChange", [u, u.currentSlide, s]), o = u.currentSlide, u.currentSlide = s, u.setSlideClasses(u.currentSlide), u.options.asNavFor && (a = u.getNavTarget(), a = a.slick("getSlick"), a.slideCount <= a.options.slidesToShow && a.setSlideClasses(u.currentSlide)), u.updateDots(), u.updateArrows(), u.options.fade === !0 ? (i !== !0 ? (u.fadeSlideOut(o), u.fadeSlide(s, function () {
              u.postSlide(s)
            })) : u.postSlide(s), void u.animateHeight()) : void(i !== !0 ? u.animateSlide(l, function () {
              u.postSlide(s)
            }) : u.postSlide(s)))
  }, e.prototype.startLoad = function () {
    var t = this;
    t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow.hide(), t.$nextArrow.hide()), t.options.dots === !0 && t.slideCount > t.options.slidesToShow && t.$dots.hide(), t.$slider.addClass("slick-loading")
  }, e.prototype.swipeDirection = function () {
    var t, e, i, n, s = this;
    return t = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, i = Math.atan2(e, t), n = Math.round(180 * i / Math.PI), n < 0 && (n = 360 - Math.abs(n)), n <= 45 && n >= 0 ? s.options.rtl === !1 ? "left" : "right" : n <= 360 && n >= 315 ? s.options.rtl === !1 ? "left" : "right" : n >= 135 && n <= 225 ? s.options.rtl === !1 ? "right" : "left" : s.options.verticalSwiping === !0 ? n >= 35 && n <= 135 ? "down" : "up" : "vertical"
  }, e.prototype.swipeEnd = function (t) {
    var e, i, n = this;
    if (n.dragging = !1, n.interrupted = !1, n.shouldClick = !(n.touchObject.swipeLength > 10), void 0 === n.touchObject.curX)return !1;
    if (n.touchObject.edgeHit === !0 && n.$slider.trigger("edge", [n, n.swipeDirection()]), n.touchObject.swipeLength >= n.touchObject.minSwipe) {
      switch (i = n.swipeDirection()) {
        case"left":
        case"down":
          e = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide + n.getSlideCount()) : n.currentSlide + n.getSlideCount(), n.currentDirection = 0;
          break;
        case"right":
        case"up":
          e = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide - n.getSlideCount()) : n.currentSlide - n.getSlideCount(), n.currentDirection = 1
      }
      "vertical" != i && (n.slideHandler(e), n.touchObject = {}, n.$slider.trigger("swipe", [n, i]))
    } else n.touchObject.startX !== n.touchObject.curX && (n.slideHandler(n.currentSlide), n.touchObject = {})
  }, e.prototype.swipeHandler = function (t) {
    var e = this;
    if (!(e.options.swipe === !1 || "ontouchend" in document && e.options.swipe === !1 || e.options.draggable === !1 && t.type.indexOf("mouse") !== -1))switch (e.touchObject.fingerCount = t.originalEvent && void 0 !== t.originalEvent.touches ? t.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, e.options.verticalSwiping === !0 && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
      t.data.action) {
      case"start":
        e.swipeStart(t);
        break;
      case"move":
        e.swipeMove(t);
        break;
      case"end":
        e.swipeEnd(t)
    }
  }, e.prototype.swipeMove = function (t) {
    var e, i, n, s, o, r = this;
    return o = void 0 !== t.originalEvent ? t.originalEvent.touches : null, !(!r.dragging || o && 1 !== o.length) && (e = r.getLeft(r.currentSlide), r.touchObject.curX = void 0 !== o ? o[0].pageX : t.clientX, r.touchObject.curY = void 0 !== o ? o[0].pageY : t.clientY, r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curX - r.touchObject.startX, 2))), r.options.verticalSwiping === !0 && (r.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(r.touchObject.curY - r.touchObject.startY, 2)))), i = r.swipeDirection(), "vertical" !== i ? (void 0 !== t.originalEvent && r.touchObject.swipeLength > 4 && t.preventDefault(), s = (r.options.rtl === !1 ? 1 : -1) * (r.touchObject.curX > r.touchObject.startX ? 1 : -1), r.options.verticalSwiping === !0 && (s = r.touchObject.curY > r.touchObject.startY ? 1 : -1), n = r.touchObject.swipeLength, r.touchObject.edgeHit = !1, r.options.infinite === !1 && (0 === r.currentSlide && "right" === i || r.currentSlide >= r.getDotCount() && "left" === i) && (n = r.touchObject.swipeLength * r.options.edgeFriction, r.touchObject.edgeHit = !0), r.options.vertical === !1 ? r.swipeLeft = e + n * s : r.swipeLeft = e + n * (r.$list.height() / r.listWidth) * s, r.options.verticalSwiping === !0 && (r.swipeLeft = e + n * s), r.options.fade !== !0 && r.options.touchMove !== !1 && (r.animating === !0 ? (r.swipeLeft = null, !1) : void r.setCSS(r.swipeLeft))) : void 0)
  }, e.prototype.swipeStart = function (t) {
    var e, i = this;
    return i.interrupted = !0, 1 !== i.touchObject.fingerCount || i.slideCount <= i.options.slidesToShow ? (i.touchObject = {}, !1) : (void 0 !== t.originalEvent && void 0 !== t.originalEvent.touches && (e = t.originalEvent.touches[0]), i.touchObject.startX = i.touchObject.curX = void 0 !== e ? e.pageX : t.clientX, i.touchObject.startY = i.touchObject.curY = void 0 !== e ? e.pageY : t.clientY, void(i.dragging = !0))
  }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
    var t = this;
    null !== t.$slidesCache && (t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.appendTo(t.$slideTrack), t.reinit())
  }, e.prototype.unload = function () {
    var e = this;
    t(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
  }, e.prototype.unslick = function (t) {
    var e = this;
    e.$slider.trigger("unslick", [e, t]), e.destroy()
  }, e.prototype.updateArrows = function () {
    var t, e = this;
    t = Math.floor(e.options.slidesToShow / 2), e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && e.options.centerMode === !1 ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && e.options.centerMode === !0 && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
  }, e.prototype.updateDots = function () {
    var t = this;
    null !== t.$dots && (t.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), t.$dots.find("li").eq(Math.floor(t.currentSlide / t.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
  }, e.prototype.visibility = function () {
    var t = this;
    t.options.autoplay && (document[t.hidden] ? t.interrupted = !0 : t.interrupted = !1)
  }, t.fn.slick = function () {
    var t, i, n = this, s = arguments[0], o = Array.prototype.slice.call(arguments, 1), r = n.length;
    for (t = 0; t < r; t++)if ("object" == typeof s || "undefined" == typeof s ? n[t].slick = new e(n[t], s) : i = n[t].slick[s].apply(n[t].slick, o), "undefined" != typeof i)return i;
    return n
  }
}), function (t, e) {
  "function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function (i) {
      return t.Bloodhound = e(i)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : t.Bloodhound = e(jQuery)
}(this, function (t) {
  var e = function () {
    "use strict";
    return {
      isMsie: function () {
        return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
      }, isBlankString: function (t) {
        return !t || /^\s*$/.test(t)
      }, escapeRegExChars: function (t) {
        return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      }, isString: function (t) {
        return "string" == typeof t
      }, isNumber: function (t) {
        return "number" == typeof t
      }, isArray: t.isArray, isFunction: t.isFunction, isObject: t.isPlainObject, isUndefined: function (t) {
        return "undefined" == typeof t
      }, isElement: function (t) {
        return !(!t || 1 !== t.nodeType)
      }, isJQuery: function (e) {
        return e instanceof t
      }, toStr: function (t) {
        return e.isUndefined(t) || null === t ? "" : t + ""
      }, bind: t.proxy, each: function (e, i) {
        function n(t, e) {
          return i(e, t)
        }

        t.each(e, n)
      }, map: t.map, filter: t.grep, every: function (e, i) {
        var n = !0;
        return e ? (t.each(e, function (t, s) {
            if (!(n = i.call(null, s, t, e)))return !1
          }), !!n) : n
      }, some: function (e, i) {
        var n = !1;
        return e ? (t.each(e, function (t, s) {
            if (n = i.call(null, s, t, e))return !1
          }), !!n) : n
      }, mixin: t.extend, identity: function (t) {
        return t
      }, clone: function (e) {
        return t.extend(!0, {}, e)
      }, getIdGenerator: function () {
        var t = 0;
        return function () {
          return t++
        }
      }, templatify: function (e) {
        function i() {
          return String(e)
        }

        return t.isFunction(e) ? e : i
      }, defer: function (t) {
        setTimeout(t, 0)
      }, debounce: function (t, e, i) {
        var n, s;
        return function () {
          var o, r, a = this, l = arguments;
          return o = function () {
            n = null, i || (s = t.apply(a, l))
          }, r = i && !n, clearTimeout(n), n = setTimeout(o, e), r && (s = t.apply(a, l)), s
        }
      }, throttle: function (t, e) {
        var i, n, s, o, r, a;
        return r = 0, a = function () {
          r = new Date, s = null, o = t.apply(i, n)
        }, function () {
          var l = new Date, u = e - (l - r);
          return i = this, n = arguments, u <= 0 ? (clearTimeout(s), s = null, r = l, o = t.apply(i, n)) : s || (s = setTimeout(a, u)), o
        }
      }, stringify: function (t) {
        return e.isString(t) ? t : JSON.stringify(t)
      }, noop: function () {
      }
    }
  }(), i = "0.11.1", n = function () {
    "use strict";
    function t(t) {
      return t = e.toStr(t), t ? t.split(/\s+/) : []
    }

    function i(t) {
      return t = e.toStr(t), t ? t.split(/\W+/) : []
    }

    function n(t) {
      return function (i) {
        return i = e.isArray(i) ? i : [].slice.call(arguments, 0), function (n) {
          var s = [];
          return e.each(i, function (i) {
            s = s.concat(t(e.toStr(n[i])))
          }), s
        }
      }
    }

    return { nonword: i, whitespace: t, obj: { nonword: n(i), whitespace: n(t) } }
  }(), s = function () {
    "use strict";
    function i(i) {
      this.maxSize = e.isNumber(i) ? i : 100, this.reset(), this.maxSize <= 0 && (this.set = this.get = t.noop)
    }

    function n() {
      this.head = this.tail = null
    }

    function s(t, e) {
      this.key = t, this.val = e, this.prev = this.next = null
    }

    return e.mixin(i.prototype, {
      set: function (t, e) {
        var i, n = this.list.tail;
        this.size >= this.maxSize && (this.list.remove(n), delete this.hash[n.key], this.size--), (i = this.hash[t]) ? (i.val = e, this.list.moveToFront(i)) : (i = new s(t, e), this.list.add(i), this.hash[t] = i, this.size++)
      }, get: function (t) {
        var e = this.hash[t];
        if (e)return this.list.moveToFront(e), e.val
      }, reset: function () {
        this.size = 0, this.hash = {}, this.list = new n
      }
    }), e.mixin(n.prototype, {
      add: function (t) {
        this.head && (t.next = this.head, this.head.prev = t), this.head = t, this.tail = this.tail || t
      }, remove: function (t) {
        t.prev ? t.prev.next = t.next : this.head = t.next, t.next ? t.next.prev = t.prev : this.tail = t.prev
      }, moveToFront: function (t) {
        this.remove(t), this.add(t)
      }
    }), i
  }(), o = function () {
    "use strict";
    function i(t, i) {
      this.prefix = ["__", t, "__"].join(""), this.ttlKey = "__ttl__", this.keyMatcher = new RegExp("^" + e.escapeRegExChars(this.prefix)), this.ls = i || a, !this.ls && this._noop()
    }

    function n() {
      return (new Date).getTime()
    }

    function s(t) {
      return JSON.stringify(e.isUndefined(t) ? null : t)
    }

    function o(e) {
      return t.parseJSON(e)
    }

    function r(t) {
      var e, i, n = [], s = a.length;
      for (e = 0; e < s; e++)(i = a.key(e)).match(t) && n.push(i.replace(t, ""));
      return n
    }

    var a;
    try {
      a = window.localStorage, a.setItem("~~~", "!"), a.removeItem("~~~")
    } catch (l) {
      a = null
    }
    return e.mixin(i.prototype, {
      _prefix: function (t) {
        return this.prefix + t
      }, _ttlKey: function (t) {
        return this._prefix(t) + this.ttlKey
      }, _noop: function () {
        this.get = this.set = this.remove = this.clear = this.isExpired = e.noop
      }, _safeSet: function (t, e) {
        try {
          this.ls.setItem(t, e)
        } catch (i) {
          "QuotaExceededError" === i.name && (this.clear(), this._noop())
        }
      }, get: function (t) {
        return this.isExpired(t) && this.remove(t), o(this.ls.getItem(this._prefix(t)))
      }, set: function (t, i, o) {
        return e.isNumber(o) ? this._safeSet(this._ttlKey(t), s(n() + o)) : this.ls.removeItem(this._ttlKey(t)), this._safeSet(this._prefix(t), s(i))
      }, remove: function (t) {
        return this.ls.removeItem(this._ttlKey(t)), this.ls.removeItem(this._prefix(t)), this
      }, clear: function () {
        var t, e = r(this.keyMatcher);
        for (t = e.length; t--;)this.remove(e[t]);
        return this
      }, isExpired: function (t) {
        var i = o(this.ls.getItem(this._ttlKey(t)));
        return !!(e.isNumber(i) && n() > i)
      }
    }), i
  }(), r = function () {
    "use strict";
    function i(t) {
      t = t || {}, this.cancelled = !1, this.lastReq = null, this._send = t.transport, this._get = t.limiter ? t.limiter(this._get) : this._get, this._cache = t.cache === !1 ? new s(0) : a
    }

    var n = 0, o = {}, r = 6, a = new s(10);
    return i.setMaxPendingRequests = function (t) {
      r = t
    }, i.resetCache = function () {
      a.reset()
    }, e.mixin(i.prototype, {
      _fingerprint: function (e) {
        return e = e || {}, e.url + e.type + t.param(e.data || {})
      }, _get: function (t, e) {
        function i(t) {
          e(null, t), d._cache.set(l, t)
        }

        function s() {
          e(!0)
        }

        function a() {
          n--, delete o[l], d.onDeckRequestArgs && (d._get.apply(d, d.onDeckRequestArgs), d.onDeckRequestArgs = null)
        }

        var l, u, d = this;
        l = this._fingerprint(t), this.cancelled || l !== this.lastReq || ((u = o[l]) ? u.done(i).fail(s) : n < r ? (n++, o[l] = this._send(t).done(i).fail(s).always(a)) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
      }, get: function (i, n) {
        var s, o;
        n = n || t.noop, i = e.isString(i) ? { url: i } : i || {}, o = this._fingerprint(i), this.cancelled = !1, this.lastReq = o, (s = this._cache.get(o)) ? n(null, s) : this._get(i, n)
      }, cancel: function () {
        this.cancelled = !0
      }
    }), i
  }(), a = window.SearchIndex = function () {
    "use strict";
    function i(i) {
      i = i || {}, i.datumTokenizer && i.queryTokenizer || t.error("datumTokenizer and queryTokenizer are both required"), this.identify = i.identify || e.stringify, this.datumTokenizer = i.datumTokenizer, this.queryTokenizer = i.queryTokenizer, this.reset()
    }

    function n(t) {
      return t = e.filter(t, function (t) {
        return !!t
      }), t = e.map(t, function (t) {
        return t.toLowerCase()
      })
    }

    function s() {
      var t = {};
      return t[l] = [], t[a] = {}, t
    }

    function o(t) {
      for (var e = {}, i = [], n = 0, s = t.length; n < s; n++)e[t[n]] || (e[t[n]] = !0, i.push(t[n]));
      return i
    }

    function r(t, e) {
      var i = 0, n = 0, s = [];
      t = t.sort(), e = e.sort();
      for (var o = t.length, r = e.length; i < o && n < r;)t[i] < e[n] ? i++ : t[i] > e[n] ? n++ : (s.push(t[i]), i++, n++);
      return s
    }

    var a = "c", l = "i";
    return e.mixin(i.prototype, {
      bootstrap: function (t) {
        this.datums = t.datums, this.trie = t.trie
      }, add: function (t) {
        var i = this;
        t = e.isArray(t) ? t : [t], e.each(t, function (t) {
          var o, r;
          i.datums[o = i.identify(t)] = t, r = n(i.datumTokenizer(t)), e.each(r, function (t) {
            var e, n, r;
            for (e = i.trie, n = t.split(""); r = n.shift();)e = e[a][r] || (e[a][r] = s()), e[l].push(o)
          })
        })
      }, get: function (t) {
        var i = this;
        return e.map(t, function (t) {
          return i.datums[t]
        })
      }, search: function (t) {
        var i, s, u = this;
        return i = n(this.queryTokenizer(t)), e.each(i, function (t) {
          var e, i, n, o;
          if (s && 0 === s.length)return !1;
          for (e = u.trie, i = t.split(""); e && (n = i.shift());)e = e[a][n];
          return e && 0 === i.length ? (o = e[l].slice(0), void(s = s ? r(s, o) : o)) : (s = [], !1)
        }), s ? e.map(o(s), function (t) {
            return u.datums[t]
          }) : []
      }, all: function () {
        var t = [];
        for (var e in this.datums)t.push(this.datums[e]);
        return t
      }, reset: function () {
        this.datums = {}, this.trie = s()
      }, serialize: function () {
        return { datums: this.datums, trie: this.trie }
      }
    }), i
  }(), l = function () {
    "use strict";
    function t(t) {
      this.url = t.url, this.ttl = t.ttl, this.cache = t.cache, this.prepare = t.prepare, this.transform = t.transform, this.transport = t.transport, this.thumbprint = t.thumbprint, this.storage = new o(t.cacheKey)
    }

    var i;
    return i = {
      data: "data",
      protocol: "protocol",
      thumbprint: "thumbprint"
    }, e.mixin(t.prototype, {
      _settings: function () {
        return { url: this.url, type: "GET", dataType: "json" }
      }, store: function (t) {
        this.cache && (this.storage.set(i.data, t, this.ttl), this.storage.set(i.protocol, location.protocol, this.ttl), this.storage.set(i.thumbprint, this.thumbprint, this.ttl))
      }, fromCache: function () {
        var t, e = {};
        return this.cache ? (e.data = this.storage.get(i.data), e.protocol = this.storage.get(i.protocol), e.thumbprint = this.storage.get(i.thumbprint), t = e.thumbprint !== this.thumbprint || e.protocol !== location.protocol, e.data && !t ? e.data : null) : null
      }, fromNetwork: function (t) {
        function e() {
          t(!0)
        }

        function i(e) {
          t(null, s.transform(e))
        }

        var n, s = this;
        t && (n = this.prepare(this._settings()), this.transport(n).fail(e).done(i))
      }, clear: function () {
        return this.storage.clear(), this
      }
    }), t
  }(), u = function () {
    "use strict";
    function t(t) {
      this.url = t.url, this.prepare = t.prepare, this.transform = t.transform, this.transport = new r({
        cache: t.cache,
        limiter: t.limiter,
        transport: t.transport
      })
    }

    return e.mixin(t.prototype, {
      _settings: function () {
        return { url: this.url, type: "GET", dataType: "json" }
      }, get: function (t, e) {
        function i(t, i) {
          e(t ? [] : s.transform(i))
        }

        var n, s = this;
        if (e)return t = t || "", n = this.prepare(t, this._settings()), this.transport.get(n, i)
      }, cancelLastRequest: function () {
        this.transport.cancel()
      }
    }), t
  }(), d = function () {
    "use strict";
    function n(n) {
      var s;
      return n ? (s = {
          url: null,
          ttl: 864e5,
          cache: !0,
          cacheKey: null,
          thumbprint: "",
          prepare: e.identity,
          transform: e.identity,
          transport: null
        }, n = e.isString(n) ? { url: n } : n, n = e.mixin(s, n), !n.url && t.error("prefetch requires url to be set"), n.transform = n.filter || n.transform, n.cacheKey = n.cacheKey || n.url, n.thumbprint = i + n.thumbprint, n.transport = n.transport ? a(n.transport) : t.ajax, n) : null
    }

    function s(i) {
      var n;
      if (i)return n = {
        url: null,
        cache: !0,
        prepare: null,
        replace: null,
        wildcard: null,
        limiter: null,
        rateLimitBy: "debounce",
        rateLimitWait: 300,
        transform: e.identity,
        transport: null
      }, i = e.isString(i) ? { url: i } : i, i = e.mixin(n, i), !i.url && t.error("remote requires url to be set"), i.transform = i.filter || i.transform, i.prepare = o(i), i.limiter = r(i), i.transport = i.transport ? a(i.transport) : t.ajax, delete i.replace, delete i.wildcard, delete i.rateLimitBy, delete i.rateLimitWait, i
    }

    function o(t) {
      function e(t, e) {
        return e.url = o(e.url, t), e
      }

      function i(t, e) {
        return e.url = e.url.replace(r, encodeURIComponent(t)), e
      }

      function n(t, e) {
        return e
      }

      var s, o, r;
      return s = t.prepare, o = t.replace, r = t.wildcard, s ? s : s = o ? e : t.wildcard ? i : n
    }

    function r(t) {
      function i(t) {
        return function (i) {
          return e.debounce(i, t)
        }
      }

      function n(t) {
        return function (i) {
          return e.throttle(i, t)
        }
      }

      var s, o, r;
      return s = t.limiter, o = t.rateLimitBy, r = t.rateLimitWait, s || (s = /^throttle$/i.test(o) ? n(r) : i(r)), s
    }

    function a(i) {
      return function (n) {
        function s(t) {
          e.defer(function () {
            r.resolve(t)
          })
        }

        function o(t) {
          e.defer(function () {
            r.reject(t)
          })
        }

        var r = t.Deferred();
        return i(n, s, o), r
      }
    }

    return function (i) {
      var o, r;
      return o = {
        initialize: !0,
        identify: e.stringify,
        datumTokenizer: null,
        queryTokenizer: null,
        sufficient: 5,
        sorter: null,
        local: [],
        prefetch: null,
        remote: null
      }, i = e.mixin(o, i || {}), !i.datumTokenizer && t.error("datumTokenizer is required"), !i.queryTokenizer && t.error("queryTokenizer is required"), r = i.sorter, i.sorter = r ? function (t) {
          return t.sort(r)
        } : e.identity, i.local = e.isFunction(i.local) ? i.local() : i.local, i.prefetch = n(i.prefetch), i.remote = s(i.remote), i
    }
  }(), c = function () {
    "use strict";
    function i(t) {
      t = d(t), this.sorter = t.sorter, this.identify = t.identify, this.sufficient = t.sufficient, this.local = t.local, this.remote = t.remote ? new u(t.remote) : null, this.prefetch = t.prefetch ? new l(t.prefetch) : null, this.index = new a({
        identify: this.identify,
        datumTokenizer: t.datumTokenizer,
        queryTokenizer: t.queryTokenizer
      }), t.initialize !== !1 && this.initialize()
    }

    var s;
    return s = window && window.Bloodhound, i.noConflict = function () {
      return window && (window.Bloodhound = s), i
    }, i.tokenizers = n, e.mixin(i.prototype, {
      __ttAdapter: function () {
        function t(t, e, n) {
          return i.search(t, e, n)
        }

        function e(t, e) {
          return i.search(t, e)
        }

        var i = this;
        return this.remote ? t : e
      }, _loadPrefetch: function () {
        function e(t, e) {
          return t ? i.reject() : (s.add(e), s.prefetch.store(s.index.serialize()), void i.resolve())
        }

        var i, n, s = this;
        return i = t.Deferred(), this.prefetch ? (n = this.prefetch.fromCache()) ? (this.index.bootstrap(n), i.resolve()) : this.prefetch.fromNetwork(e) : i.resolve(), i.promise()
      }, _initialize: function () {
        function t() {
          e.add(e.local)
        }

        var e = this;
        return this.clear(), (this.initPromise = this._loadPrefetch()).done(t), this.initPromise
      }, initialize: function (t) {
        return !this.initPromise || t ? this._initialize() : this.initPromise
      }, add: function (t) {
        return this.index.add(t), this
      }, get: function (t) {
        return t = e.isArray(t) ? t : [].slice.call(arguments), this.index.get(t)
      }, search: function (t, i, n) {
        function s(t) {
          var i = [];
          e.each(t, function (t) {
            !e.some(o, function (e) {
              return r.identify(t) === r.identify(e)
            }) && i.push(t)
          }), n && n(i)
        }

        var o, r = this;
        return o = this.sorter(this.index.search(t)), i(this.remote ? o.slice() : o), this.remote && o.length < this.sufficient ? this.remote.get(t, s) : this.remote && this.remote.cancelLastRequest(), this
      }, all: function () {
        return this.index.all()
      }, clear: function () {
        return this.index.reset(), this
      }, clearPrefetchCache: function () {
        return this.prefetch && this.prefetch.clear(), this
      }, clearRemoteCache: function () {
        return r.resetCache(), this
      }, ttAdapter: function () {
        return this.__ttAdapter()
      }
    }), i
  }();
  return c
}), function (t, e) {
  "function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function (t) {
      return e(t)
    }) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(this, function (t) {
  var e = function () {
    "use strict";
    return {
      isMsie: function () {
        return !!/(msie|trident)/i.test(navigator.userAgent) && navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
      }, isBlankString: function (t) {
        return !t || /^\s*$/.test(t)
      }, escapeRegExChars: function (t) {
        return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      }, isString: function (t) {
        return "string" == typeof t
      }, isNumber: function (t) {
        return "number" == typeof t
      }, isArray: t.isArray, isFunction: t.isFunction, isObject: t.isPlainObject, isUndefined: function (t) {
        return "undefined" == typeof t
      }, isElement: function (t) {
        return !(!t || 1 !== t.nodeType)
      }, isJQuery: function (e) {
        return e instanceof t
      }, toStr: function (t) {
        return e.isUndefined(t) || null === t ? "" : t + ""
      }, bind: t.proxy, each: function (e, i) {
        function n(t, e) {
          return i(e, t)
        }

        t.each(e, n)
      }, map: t.map, filter: t.grep, every: function (e, i) {
        var n = !0;
        return e ? (t.each(e, function (t, s) {
            if (!(n = i.call(null, s, t, e)))return !1
          }), !!n) : n
      }, some: function (e, i) {
        var n = !1;
        return e ? (t.each(e, function (t, s) {
            if (n = i.call(null, s, t, e))return !1
          }), !!n) : n
      }, mixin: t.extend, identity: function (t) {
        return t
      }, clone: function (e) {
        return t.extend(!0, {}, e)
      }, getIdGenerator: function () {
        var t = 0;
        return function () {
          return t++
        }
      }, templatify: function (e) {
        function i() {
          return String(e)
        }

        return t.isFunction(e) ? e : i
      }, defer: function (t) {
        setTimeout(t, 0)
      }, debounce: function (t, e, i) {
        var n, s;
        return function () {
          var o, r, a = this, l = arguments;
          return o = function () {
            n = null, i || (s = t.apply(a, l))
          }, r = i && !n, clearTimeout(n), n = setTimeout(o, e), r && (s = t.apply(a, l)), s
        }
      }, throttle: function (t, e) {
        var i, n, s, o, r, a;
        return r = 0, a = function () {
          r = new Date, s = null, o = t.apply(i, n)
        }, function () {
          var l = new Date, u = e - (l - r);
          return i = this, n = arguments, u <= 0 ? (clearTimeout(s), s = null, r = l, o = t.apply(i, n)) : s || (s = setTimeout(a, u)), o
        }
      }, stringify: function (t) {
        return e.isString(t) ? t : JSON.stringify(t)
      }, noop: function () {
      }
    }
  }(), i = function () {
    "use strict";
    function t(t) {
      var r, a;
      return a = e.mixin({}, o, t), r = { css: s(), classes: a, html: i(a), selectors: n(a) }, {
        css: r.css,
        html: r.html,
        classes: r.classes,
        selectors: r.selectors,
        mixin: function (t) {
          e.mixin(t, r)
        }
      }
    }

    function i(t) {
      return { wrapper: '<span class="' + t.wrapper + '"></span>', menu: '<div class="' + t.menu + '"></div>' }
    }

    function n(t) {
      var i = {};
      return e.each(t, function (t, e) {
        i[e] = "." + t
      }), i
    }

    function s() {
      var t = {
        wrapper: { position: "relative", display: "inline-block" },
        hint: {
          position: "absolute",
          top: "0",
          left: "0",
          borderColor: "transparent",
          boxShadow: "none",
          opacity: "1"
        },
        input: { position: "relative", verticalAlign: "top", backgroundColor: "transparent" },
        inputWithNoHint: { position: "relative", verticalAlign: "top" },
        menu: { position: "absolute", top: "100%", left: "0", zIndex: "100", display: "none" },
        ltr: { left: "0", right: "auto" },
        rtl: { left: "auto", right: " 0" }
      };
      return e.isMsie() && e.mixin(t.input, { backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)" }), t
    }

    var o = {
      wrapper: "twitter-typeahead",
      input: "tt-input",
      hint: "tt-hint",
      menu: "tt-menu",
      dataset: "tt-dataset",
      suggestion: "tt-suggestion",
      selectable: "tt-selectable",
      empty: "tt-empty",
      open: "tt-open",
      cursor: "tt-cursor",
      highlight: "tt-highlight"
    };
    return t
  }(), n = function () {
    "use strict";
    function i(e) {
      e && e.el || t.error("EventBus initialized without el"), this.$el = t(e.el)
    }

    var n, s;
    return n = "typeahead:", s = {
      render: "rendered",
      cursorchange: "cursorchanged",
      select: "selected",
      autocomplete: "autocompleted"
    }, e.mixin(i.prototype, {
      _trigger: function (e, i) {
        var s;
        return s = t.Event(n + e), (i = i || []).unshift(s), this.$el.trigger.apply(this.$el, i), s
      }, before: function (t) {
        var e, i;
        return e = [].slice.call(arguments, 1), i = this._trigger("before" + t, e), i.isDefaultPrevented()
      }, trigger: function (t) {
        var e;
        this._trigger(t, [].slice.call(arguments, 1)), (e = s[t]) && this._trigger(e, [].slice.call(arguments, 1))
      }
    }), i
  }(), s = function () {
    "use strict";
    function t(t, e, i, n) {
      var s;
      if (!i)return this;
      for (e = e.split(l), i = n ? a(i, n) : i, this._callbacks = this._callbacks || {}; s = e.shift();)this._callbacks[s] = this._callbacks[s] || {
          sync: [],
          async: []
        }, this._callbacks[s][t].push(i);
      return this
    }

    function e(e, i, n) {
      return t.call(this, "async", e, i, n)
    }

    function i(e, i, n) {
      return t.call(this, "sync", e, i, n)
    }

    function n(t) {
      var e;
      if (!this._callbacks)return this;
      for (t = t.split(l); e = t.shift();)delete this._callbacks[e];
      return this
    }

    function s(t) {
      var e, i, n, s, r;
      if (!this._callbacks)return this;
      for (t = t.split(l), n = [].slice.call(arguments, 1); (e = t.shift()) && (i = this._callbacks[e]);)s = o(i.sync, this, [e].concat(n)), r = o(i.async, this, [e].concat(n)), s() && u(r);
      return this
    }

    function o(t, e, i) {
      function n() {
        for (var n, s = 0, o = t.length; !n && s < o; s += 1)n = t[s].apply(e, i) === !1;
        return !n
      }

      return n
    }

    function r() {
      var t;
      return t = window.setImmediate ? function (t) {
          setImmediate(function () {
            t()
          })
        } : function (t) {
          setTimeout(function () {
            t()
          }, 0)
        }
    }

    function a(t, e) {
      return t.bind ? t.bind(e) : function () {
          t.apply(e, [].slice.call(arguments, 0))
        }
    }

    var l = /\s+/, u = r();
    return { onSync: i, onAsync: e, off: n, trigger: s }
  }(), o = function (t) {
    "use strict";
    function i(t, i, n) {
      for (var s, o = [], r = 0, a = t.length; r < a; r++)o.push(e.escapeRegExChars(t[r]));
      return s = n ? "\\b(" + o.join("|") + ")\\b" : "(" + o.join("|") + ")", i ? new RegExp(s) : new RegExp(s, "i")
    }

    var n = { node: null, pattern: null, tagName: "strong", className: null, wordsOnly: !1, caseSensitive: !1 };
    return function (s) {
      function o(e) {
        var i, n, o;
        return (i = a.exec(e.data)) && (o = t.createElement(s.tagName), s.className && (o.className = s.className), n = e.splitText(i.index), n.splitText(i[0].length), o.appendChild(n.cloneNode(!0)), e.parentNode.replaceChild(o, n)), !!i
      }

      function r(t, e) {
        for (var i, n = 3, s = 0; s < t.childNodes.length; s++)i = t.childNodes[s], i.nodeType === n ? s += e(i) ? 1 : 0 : r(i, e)
      }

      var a;
      s = e.mixin({}, n, s), s.node && s.pattern && (s.pattern = e.isArray(s.pattern) ? s.pattern : [s.pattern], a = i(s.pattern, s.caseSensitive, s.wordsOnly), r(s.node, o))
    }
  }(window.document), r = function () {
    "use strict";
    function i(i, s) {
      i = i || {}, i.input || t.error("input is missing"), s.mixin(this), this.$hint = t(i.hint), this.$input = t(i.input), this.query = this.$input.val(), this.queryWhenFocused = this.hasFocus() ? this.query : null, this.$overflowHelper = n(this.$input), this._checkLanguageDirection(), 0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = e.noop)
    }

    function n(e) {
      return t('<pre aria-hidden="true"></pre>').css({
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "pre",
        fontFamily: e.css("font-family"),
        fontSize: e.css("font-size"),
        fontStyle: e.css("font-style"),
        fontVariant: e.css("font-variant"),
        fontWeight: e.css("font-weight"),
        wordSpacing: e.css("word-spacing"),
        letterSpacing: e.css("letter-spacing"),
        textIndent: e.css("text-indent"),
        textRendering: e.css("text-rendering"),
        textTransform: e.css("text-transform")
      }).insertAfter(e)
    }

    function o(t, e) {
      return i.normalizeQuery(t) === i.normalizeQuery(e)
    }

    function r(t) {
      return t.altKey || t.ctrlKey || t.metaKey || t.shiftKey
    }

    var a;
    return a = {
      9: "tab",
      27: "esc",
      37: "left",
      39: "right",
      13: "enter",
      38: "up",
      40: "down"
    }, i.normalizeQuery = function (t) {
      return e.toStr(t).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
    }, e.mixin(i.prototype, s, {
      _onBlur: function () {
        this.resetInputValue(), this.trigger("blurred")
      }, _onFocus: function () {
        this.queryWhenFocused = this.query, this.trigger("focused")
      }, _onKeydown: function (t) {
        var e = a[t.which || t.keyCode];
        this._managePreventDefault(e, t), e && this._shouldTrigger(e, t) && this.trigger(e + "Keyed", t)
      }, _onInput: function () {
        this._setQuery(this.getInputValue()), this.clearHintIfInvalid(), this._checkLanguageDirection()
      }, _managePreventDefault: function (t, e) {
        var i;
        switch (t) {
          case"up":
          case"down":
            i = !r(e);
            break;
          default:
            i = !1
        }
        i && e.preventDefault()
      }, _shouldTrigger: function (t, e) {
        var i;
        switch (t) {
          case"tab":
            i = !r(e);
            break;
          default:
            i = !0
        }
        return i
      }, _checkLanguageDirection: function () {
        var t = (this.$input.css("direction") || "ltr").toLowerCase();
        this.dir !== t && (this.dir = t, this.$hint.attr("dir", t), this.trigger("langDirChanged", t))
      }, _setQuery: function (t, e) {
        var i, n;
        i = o(t, this.query), n = !!i && this.query.length !== t.length, this.query = t, e || i ? !e && n && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
      }, bind: function () {
        var t, i, n, s, o = this;
        return t = e.bind(this._onBlur, this), i = e.bind(this._onFocus, this), n = e.bind(this._onKeydown, this), s = e.bind(this._onInput, this), this.$input.on("blur.tt", t).on("focus.tt", i).on("keydown.tt", n), !e.isMsie() || e.isMsie() > 9 ? this.$input.on("input.tt", s) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function (t) {
            a[t.which || t.keyCode] || e.defer(e.bind(o._onInput, o, t))
          }), this
      }, focus: function () {
        this.$input.focus()
      }, blur: function () {
        this.$input.blur()
      }, getLangDir: function () {
        return this.dir
      }, getQuery: function () {
        return this.query || ""
      }, setQuery: function (t, e) {
        this.setInputValue(t), this._setQuery(t, e)
      }, hasQueryChangedSinceLastFocus: function () {
        return this.query !== this.queryWhenFocused
      }, getInputValue: function () {
        return this.$input.val()
      }, setInputValue: function (t) {
        this.$input.val(t), this.clearHintIfInvalid(), this._checkLanguageDirection()
      }, resetInputValue: function () {
        this.setInputValue(this.query)
      }, getHint: function () {
        return this.$hint.val()
      }, setHint: function (t) {
        this.$hint.val(t)
      }, clearHint: function () {
        this.setHint("")
      }, clearHintIfInvalid: function () {
        var t, e, i, n;
        t = this.getInputValue(), e = this.getHint(), i = t !== e && 0 === e.indexOf(t), n = "" !== t && i && !this.hasOverflow(), !n && this.clearHint()
      }, hasFocus: function () {
        return this.$input.is(":focus")
      }, hasOverflow: function () {
        var t = this.$input.width() - 2;
        return this.$overflowHelper.text(this.getInputValue()), this.$overflowHelper.width() >= t
      }, isCursorAtEnd: function () {
        var t, i, n;
        return t = this.$input.val().length, i = this.$input[0].selectionStart, e.isNumber(i) ? i === t : !document.selection || (n = document.selection.createRange(), n.moveStart("character", -t), t === n.text.length)
      }, destroy: function () {
        this.$hint.off(".tt"), this.$input.off(".tt"), this.$overflowHelper.remove(), this.$hint = this.$input = this.$overflowHelper = t("<div>")
      }
    }), i
  }(), a = function () {
    "use strict";
    function i(i, s) {
      i = i || {}, i.templates = i.templates || {}, i.templates.notFound = i.templates.notFound || i.templates.empty, i.source || t.error("missing source"), i.node || t.error("missing node"), i.name && !a(i.name) && t.error("invalid dataset name: " + i.name), s.mixin(this), this.highlight = !!i.highlight, this.name = i.name || u(), this.limit = i.limit || 5, this.displayFn = n(i.display || i.displayKey), this.templates = r(i.templates, this.displayFn), this.source = i.source.__ttAdapter ? i.source.__ttAdapter() : i.source, this.async = e.isUndefined(i.async) ? this.source.length > 2 : !!i.async, this._resetLastSuggestion(), this.$el = t(i.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
    }

    function n(t) {
      function i(e) {
        return e[t]
      }

      return t = t || e.stringify, e.isFunction(t) ? t : i
    }

    function r(i, n) {
      function s(e) {
        return t("<div>").text(n(e))
      }

      return {
        notFound: i.notFound && e.templatify(i.notFound),
        pending: i.pending && e.templatify(i.pending),
        header: i.header && e.templatify(i.header),
        footer: i.footer && e.templatify(i.footer),
        suggestion: i.suggestion || s
      }
    }

    function a(t) {
      return /^[_a-zA-Z0-9-]+$/.test(t)
    }

    var l, u;
    return l = {
      val: "tt-selectable-display",
      obj: "tt-selectable-object"
    }, u = e.getIdGenerator(), i.extractData = function (e) {
      var i = t(e);
      return i.data(l.obj) ? { val: i.data(l.val) || "", obj: i.data(l.obj) || null } : null
    }, e.mixin(i.prototype, s, {
      _overwrite: function (t, e) {
        e = e || [], e.length ? this._renderSuggestions(t, e) : this.async && this.templates.pending ? this._renderPending(t) : !this.async && this.templates.notFound ? this._renderNotFound(t) : this._empty(), this.trigger("rendered", this.name, e, !1)
      }, _append: function (t, e) {
        e = e || [], e.length && this.$lastSuggestion.length ? this._appendSuggestions(t, e) : e.length ? this._renderSuggestions(t, e) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(t), this.trigger("rendered", this.name, e, !0)
      }, _renderSuggestions: function (t, e) {
        var i;
        i = this._getSuggestionsFragment(t, e), this.$lastSuggestion = i.children().last(), this.$el.html(i).prepend(this._getHeader(t, e)).append(this._getFooter(t, e))
      }, _appendSuggestions: function (t, e) {
        var i, n;
        i = this._getSuggestionsFragment(t, e), n = i.children().last(), this.$lastSuggestion.after(i), this.$lastSuggestion = n
      }, _renderPending: function (t) {
        var e = this.templates.pending;
        this._resetLastSuggestion(), e && this.$el.html(e({ query: t, dataset: this.name }))
      }, _renderNotFound: function (t) {
        var e = this.templates.notFound;
        this._resetLastSuggestion(), e && this.$el.html(e({ query: t, dataset: this.name }))
      }, _empty: function () {
        this.$el.empty(), this._resetLastSuggestion()
      }, _getSuggestionsFragment: function (i, n) {
        var s, r = this;
        return s = document.createDocumentFragment(), e.each(n, function (e) {
          var n, o;
          o = r._injectQuery(i, e), n = t(r.templates.suggestion(o)).data(l.obj, e).data(l.val, r.displayFn(e)).addClass(r.classes.suggestion + " " + r.classes.selectable), s.appendChild(n[0])
        }), this.highlight && o({ className: this.classes.highlight, node: s, pattern: i }), t(s)
      }, _getFooter: function (t, e) {
        return this.templates.footer ? this.templates.footer({ query: t, suggestions: e, dataset: this.name }) : null
      }, _getHeader: function (t, e) {
        return this.templates.header ? this.templates.header({ query: t, suggestions: e, dataset: this.name }) : null
      }, _resetLastSuggestion: function () {
        this.$lastSuggestion = t()
      }, _injectQuery: function (t, i) {
        return e.isObject(i) ? e.mixin({ _query: t }, i) : i
      }, update: function (e) {
        function i(t) {
          r || (r = !0, t = (t || []).slice(0, s.limit), a = t.length, s._overwrite(e, t), a < s.limit && s.async && s.trigger("asyncRequested", e))
        }

        function n(i) {
          i = i || [], !o && a < s.limit && (s.cancel = t.noop, a += i.length, s._append(e, i.slice(0, s.limit - a)), s.async && s.trigger("asyncReceived", e))
        }

        var s = this, o = !1, r = !1, a = 0;
        this.cancel(), this.cancel = function () {
          o = !0, s.cancel = t.noop, s.async && s.trigger("asyncCanceled", e)
        }, this.source(e, i, n), !r && i([])
      }, cancel: t.noop, clear: function () {
        this._empty(), this.cancel(), this.trigger("cleared")
      }, isEmpty: function () {
        return this.$el.is(":empty")
      }, destroy: function () {
        this.$el = t("<div>")
      }
    }), i
  }(), l = function () {
    "use strict";
    function i(i, n) {
      function s(e) {
        var i = o.$node.find(e.node).first();
        return e.node = i.length ? i : t("<div>").appendTo(o.$node), new a(e, n)
      }

      var o = this;
      i = i || {}, i.node || t.error("node is required"), n.mixin(this), this.$node = t(i.node), this.query = null, this.datasets = e.map(i.datasets, s)
    }

    return e.mixin(i.prototype, s, {
      _onSelectableClick: function (e) {
        this.trigger("selectableClicked", t(e.currentTarget))
      }, _onRendered: function (t, e, i, n) {
        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetRendered", e, i, n)
      }, _onCleared: function () {
        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetCleared")
      }, _propagate: function () {
        this.trigger.apply(this, arguments)
      }, _allDatasetsEmpty: function () {
        function t(t) {
          return t.isEmpty()
        }

        return e.every(this.datasets, t)
      }, _getSelectables: function () {
        return this.$node.find(this.selectors.selectable)
      }, _removeCursor: function () {
        var t = this.getActiveSelectable();
        t && t.removeClass(this.classes.cursor)
      }, _ensureVisible: function (t) {
        var e, i, n, s;
        e = t.position().top, i = e + t.outerHeight(!0), n = this.$node.scrollTop(), s = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10), e < 0 ? this.$node.scrollTop(n + e) : s < i && this.$node.scrollTop(n + (i - s))
      }, bind: function () {
        var t, i = this;
        return t = e.bind(this._onSelectableClick, this), this.$node.on("click.tt", this.selectors.selectable, t), e.each(this.datasets, function (t) {
          t.onSync("asyncRequested", i._propagate, i).onSync("asyncCanceled", i._propagate, i).onSync("asyncReceived", i._propagate, i).onSync("rendered", i._onRendered, i).onSync("cleared", i._onCleared, i);
        }), this
      }, isOpen: function () {
        return this.$node.hasClass(this.classes.open)
      }, open: function () {
        this.$node.addClass(this.classes.open)
      }, close: function () {
        this.$node.removeClass(this.classes.open), this._removeCursor()
      }, setLanguageDirection: function (t) {
        this.$node.attr("dir", t)
      }, selectableRelativeToCursor: function (t) {
        var e, i, n, s;
        return i = this.getActiveSelectable(), e = this._getSelectables(), n = i ? e.index(i) : -1, s = n + t, s = (s + 1) % (e.length + 1) - 1, s = s < -1 ? e.length - 1 : s, s === -1 ? null : e.eq(s)
      }, setCursor: function (t) {
        this._removeCursor(), (t = t && t.first()) && (t.addClass(this.classes.cursor), this._ensureVisible(t))
      }, getSelectableData: function (t) {
        return t && t.length ? a.extractData(t) : null
      }, getActiveSelectable: function () {
        var t = this._getSelectables().filter(this.selectors.cursor).first();
        return t.length ? t : null
      }, getTopSelectable: function () {
        var t = this._getSelectables().first();
        return t.length ? t : null
      }, update: function (t) {
        function i(e) {
          e.update(t)
        }

        var n = t !== this.query;
        return n && (this.query = t, e.each(this.datasets, i)), n
      }, empty: function () {
        function t(t) {
          t.clear()
        }

        e.each(this.datasets, t), this.query = null, this.$node.addClass(this.classes.empty)
      }, destroy: function () {
        function i(t) {
          t.destroy()
        }

        this.$node.off(".tt"), this.$node = t("<div>"), e.each(this.datasets, i)
      }
    }), i
  }(), u = function () {
    "use strict";
    function t() {
      l.apply(this, [].slice.call(arguments, 0))
    }

    var i = l.prototype;
    return e.mixin(t.prototype, l.prototype, {
      open: function () {
        return !this._allDatasetsEmpty() && this._show(), i.open.apply(this, [].slice.call(arguments, 0))
      }, close: function () {
        return this._hide(), i.close.apply(this, [].slice.call(arguments, 0))
      }, _onRendered: function () {
        return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), i._onRendered.apply(this, [].slice.call(arguments, 0))
      }, _onCleared: function () {
        return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), i._onCleared.apply(this, [].slice.call(arguments, 0))
      }, setLanguageDirection: function (t) {
        return this.$node.css("ltr" === t ? this.css.ltr : this.css.rtl), i.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
      }, _hide: function () {
        this.$node.hide()
      }, _show: function () {
        this.$node.css("display", "block")
      }
    }), t
  }(), d = function () {
    "use strict";
    function i(i, s) {
      var o, r, a, l, u, d, c, h, f, p, g;
      i = i || {}, i.input || t.error("missing input"), i.menu || t.error("missing menu"), i.eventBus || t.error("missing event bus"), s.mixin(this), this.eventBus = i.eventBus, this.minLength = e.isNumber(i.minLength) ? i.minLength : 1, this.input = i.input, this.menu = i.menu, this.enabled = !0, this.active = !1, this.input.hasFocus() && this.activate(), this.dir = this.input.getLangDir(), this._hacks(), this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this), o = n(this, "activate", "open", "_onFocused"), r = n(this, "deactivate", "_onBlurred"), a = n(this, "isActive", "isOpen", "_onEnterKeyed"), l = n(this, "isActive", "isOpen", "_onTabKeyed"), u = n(this, "isActive", "_onEscKeyed"), d = n(this, "isActive", "open", "_onUpKeyed"), c = n(this, "isActive", "open", "_onDownKeyed"), h = n(this, "isActive", "isOpen", "_onLeftKeyed"), f = n(this, "isActive", "isOpen", "_onRightKeyed"), p = n(this, "_openIfActive", "_onQueryChanged"), g = n(this, "_openIfActive", "_onWhitespaceChanged"), this.input.bind().onSync("focused", o, this).onSync("blurred", r, this).onSync("enterKeyed", a, this).onSync("tabKeyed", l, this).onSync("escKeyed", u, this).onSync("upKeyed", d, this).onSync("downKeyed", c, this).onSync("leftKeyed", h, this).onSync("rightKeyed", f, this).onSync("queryChanged", p, this).onSync("whitespaceChanged", g, this).onSync("langDirChanged", this._onLangDirChanged, this)
    }

    function n(t) {
      var i = [].slice.call(arguments, 1);
      return function () {
        var n = [].slice.call(arguments);
        e.each(i, function (e) {
          return t[e].apply(t, n)
        })
      }
    }

    return e.mixin(i.prototype, {
      _hacks: function () {
        var i, n;
        i = this.input.$input || t("<div>"), n = this.menu.$node || t("<div>"), i.on("blur.tt", function (t) {
          var s, o, r;
          s = document.activeElement, o = n.is(s), r = n.has(s).length > 0, e.isMsie() && (o || r) && (t.preventDefault(), t.stopImmediatePropagation(), e.defer(function () {
            i.focus()
          }))
        }), n.on("mousedown.tt", function (t) {
          t.preventDefault()
        })
      }, _onSelectableClicked: function (t, e) {
        this.select(e)
      }, _onDatasetCleared: function () {
        this._updateHint()
      }, _onDatasetRendered: function (t, e, i, n) {
        this._updateHint(), this.eventBus.trigger("render", i, n, e)
      }, _onAsyncRequested: function (t, e, i) {
        this.eventBus.trigger("asyncrequest", i, e)
      }, _onAsyncCanceled: function (t, e, i) {
        this.eventBus.trigger("asynccancel", i, e)
      }, _onAsyncReceived: function (t, e, i) {
        this.eventBus.trigger("asyncreceive", i, e)
      }, _onFocused: function () {
        this._minLengthMet() && this.menu.update(this.input.getQuery())
      }, _onBlurred: function () {
        this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
      }, _onEnterKeyed: function (t, e) {
        var i;
        (i = this.menu.getActiveSelectable()) && this.select(i) && e.preventDefault()
      }, _onTabKeyed: function (t, e) {
        var i;
        (i = this.menu.getActiveSelectable()) ? this.select(i) && e.preventDefault() : (i = this.menu.getTopSelectable()) && this.autocomplete(i) && e.preventDefault()
      }, _onEscKeyed: function () {
        this.close()
      }, _onUpKeyed: function () {
        this.moveCursor(-1)
      }, _onDownKeyed: function () {
        this.moveCursor(1)
      }, _onLeftKeyed: function () {
        "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
      }, _onRightKeyed: function () {
        "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
      }, _onQueryChanged: function (t, e) {
        this._minLengthMet(e) ? this.menu.update(e) : this.menu.empty()
      }, _onWhitespaceChanged: function () {
        this._updateHint()
      }, _onLangDirChanged: function (t, e) {
        this.dir !== e && (this.dir = e, this.menu.setLanguageDirection(e))
      }, _openIfActive: function () {
        this.isActive() && this.open()
      }, _minLengthMet: function (t) {
        return t = e.isString(t) ? t : this.input.getQuery() || "", t.length >= this.minLength
      }, _updateHint: function () {
        var t, i, n, s, o, a, l;
        t = this.menu.getTopSelectable(), i = this.menu.getSelectableData(t), n = this.input.getInputValue(), !i || e.isBlankString(n) || this.input.hasOverflow() ? this.input.clearHint() : (s = r.normalizeQuery(n), o = e.escapeRegExChars(s), a = new RegExp("^(?:" + o + ")(.+$)", "i"), l = a.exec(i.val), l && this.input.setHint(n + l[1]))
      }, isEnabled: function () {
        return this.enabled
      }, enable: function () {
        this.enabled = !0
      }, disable: function () {
        this.enabled = !1
      }, isActive: function () {
        return this.active
      }, activate: function () {
        return !!this.isActive() || !(!this.isEnabled() || this.eventBus.before("active")) && (this.active = !0, this.eventBus.trigger("active"), !0)
      }, deactivate: function () {
        return !this.isActive() || !this.eventBus.before("idle") && (this.active = !1, this.close(), this.eventBus.trigger("idle"), !0)
      }, isOpen: function () {
        return this.menu.isOpen()
      }, open: function () {
        return this.isOpen() || this.eventBus.before("open") || (this.menu.open(), this._updateHint(), this.eventBus.trigger("open")), this.isOpen()
      }, close: function () {
        return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(), this.input.clearHint(), this.input.resetInputValue(), this.eventBus.trigger("close")), !this.isOpen()
      }, setVal: function (t) {
        this.input.setQuery(e.toStr(t))
      }, getVal: function () {
        return this.input.getQuery()
      }, select: function (t) {
        var e = this.menu.getSelectableData(t);
        return !(!e || this.eventBus.before("select", e.obj)) && (this.input.setQuery(e.val, !0), this.eventBus.trigger("select", e.obj), this.close(), !0)
      }, autocomplete: function (t) {
        var e, i, n;
        return e = this.input.getQuery(), i = this.menu.getSelectableData(t), n = i && e !== i.val, !(!n || this.eventBus.before("autocomplete", i.obj)) && (this.input.setQuery(i.val), this.eventBus.trigger("autocomplete", i.obj), !0)
      }, moveCursor: function (t) {
        var e, i, n, s, o;
        return e = this.input.getQuery(), i = this.menu.selectableRelativeToCursor(t), n = this.menu.getSelectableData(i), s = n ? n.obj : null, o = this._minLengthMet() && this.menu.update(e), !o && !this.eventBus.before("cursorchange", s) && (this.menu.setCursor(i), n ? this.input.setInputValue(n.val) : (this.input.resetInputValue(), this._updateHint()), this.eventBus.trigger("cursorchange", s), !0)
      }, destroy: function () {
        this.input.destroy(), this.menu.destroy()
      }
    }), i
  }();
  !function () {
    "use strict";
    function s(e, i) {
      e.each(function () {
        var e, n = t(this);
        (e = n.data(g.typeahead)) && i(e, n)
      })
    }

    function o(t, e) {
      return t.clone().addClass(e.classes.hint).removeData().css(e.css.hint).css(c(t)).prop("readonly", !0).removeAttr("id name placeholder required").attr({
        autocomplete: "off",
        spellcheck: "false",
        tabindex: -1
      })
    }

    function a(t, e) {
      t.data(g.attrs, {
        dir: t.attr("dir"),
        autocomplete: t.attr("autocomplete"),
        spellcheck: t.attr("spellcheck"),
        style: t.attr("style")
      }), t.addClass(e.classes.input).attr({ autocomplete: "off", spellcheck: !1 });
      try {
        !t.attr("dir") && t.attr("dir", "auto")
      } catch (i) {
      }
      return t
    }

    function c(t) {
      return {
        backgroundAttachment: t.css("background-attachment"),
        backgroundClip: t.css("background-clip"),
        backgroundColor: t.css("background-color"),
        backgroundImage: t.css("background-image"),
        backgroundOrigin: t.css("background-origin"),
        backgroundPosition: t.css("background-position"),
        backgroundRepeat: t.css("background-repeat"),
        backgroundSize: t.css("background-size")
      }
    }

    function h(t) {
      var i, n;
      i = t.data(g.www), n = t.parent().filter(i.selectors.wrapper), e.each(t.data(g.attrs), function (i, n) {
        e.isUndefined(i) ? t.removeAttr(n) : t.attr(n, i)
      }), t.removeData(g.typeahead).removeData(g.www).removeData(g.attr).removeClass(i.classes.input), n.length && (t.detach().insertAfter(n), n.remove())
    }

    function f(i) {
      var n, s;
      return n = e.isJQuery(i) || e.isElement(i), s = n ? t(i).first() : [], s.length ? s : null
    }

    var p, g, m;
    p = t.fn.typeahead, g = {
      www: "tt-www",
      attrs: "tt-attrs",
      typeahead: "tt-typeahead"
    }, m = {
      initialize: function (s, c) {
        function h() {
          var i, h, m, v, y, b, w, C, k, $, x;
          e.each(c, function (t) {
            t.highlight = !!s.highlight
          }), i = t(this), h = t(p.html.wrapper), m = f(s.hint), v = f(s.menu), y = s.hint !== !1 && !m, b = s.menu !== !1 && !v, y && (m = o(i, p)), b && (v = t(p.html.menu).css(p.css.menu)), m && m.val(""), i = a(i, p), (y || b) && (h.css(p.css.wrapper), i.css(y ? p.css.input : p.css.inputWithNoHint), i.wrap(h).parent().prepend(y ? m : null).append(b ? v : null)), x = b ? u : l, w = new n({ el: i }), C = new r({
            hint: m,
            input: i
          }, p), k = new x({ node: v, datasets: c }, p), $ = new d({
            input: C,
            menu: k,
            eventBus: w,
            minLength: s.minLength
          }, p), i.data(g.www, p), i.data(g.typeahead, $)
        }

        var p;
        return c = e.isArray(c) ? c : [].slice.call(arguments, 1), s = s || {}, p = i(s.classNames), this.each(h)
      }, isEnabled: function () {
        var t;
        return s(this.first(), function (e) {
          t = e.isEnabled()
        }), t
      }, enable: function () {
        return s(this, function (t) {
          t.enable()
        }), this
      }, disable: function () {
        return s(this, function (t) {
          t.disable()
        }), this
      }, isActive: function () {
        var t;
        return s(this.first(), function (e) {
          t = e.isActive()
        }), t
      }, activate: function () {
        return s(this, function (t) {
          t.activate()
        }), this
      }, deactivate: function () {
        return s(this, function (t) {
          t.deactivate()
        }), this
      }, isOpen: function () {
        var t;
        return s(this.first(), function (e) {
          t = e.isOpen()
        }), t
      }, open: function () {
        return s(this, function (t) {
          t.open()
        }), this
      }, close: function () {
        return s(this, function (t) {
          t.close()
        }), this
      }, select: function (e) {
        var i = !1, n = t(e);
        return s(this.first(), function (t) {
          i = t.select(n)
        }), i
      }, autocomplete: function (e) {
        var i = !1, n = t(e);
        return s(this.first(), function (t) {
          i = t.autocomplete(n)
        }), i
      }, moveCursor: function (t) {
        var e = !1;
        return s(this.first(), function (i) {
          e = i.moveCursor(t)
        }), e
      }, val: function (t) {
        var e;
        return arguments.length ? (s(this, function (e) {
            e.setVal(t)
          }), this) : (s(this.first(), function (t) {
            e = t.getVal()
          }), e)
      }, destroy: function () {
        return s(this, function (t, e) {
          h(e), t.destroy()
        }), this
      }
    }, t.fn.typeahead = function (t) {
      return m[t] ? m[t].apply(this, [].slice.call(arguments, 1)) : m.initialize.apply(this, arguments)
    }, t.fn.typeahead.noConflict = function () {
      return t.fn.typeahead = p, this
    }
  }()
});