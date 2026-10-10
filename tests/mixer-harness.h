/* Run with: make test-mixer. No MIDI or network access. */
#include "../oscmix.c"

static unsigned writes, messages;
static unsigned lastreg, lastval;
static float reported;
static char reported_addr[128];

void
writemidi(const void *buf, size_t len)
{
	struct sysex sx;
	unsigned char raw[4];
	assert(sysexdec(&sx, buf, len, SYSEX_MFRID | SYSEX_DEVID | SYSEX_SUBID) == 0);
	assert(base128dec(raw, sx.data, sx.datalen) == 0);
	unsigned word = getle32(raw);
	lastreg = (word >> 16) & 0x7fff;
	lastval = word & 0xffff;
	++writes;
}

void
writeosc(const void *buf, size_t len)
{
	/* oscsend batches replies into OSC bundles. */
	const unsigned char *p = buf;
	assert(len >= 16 && memcmp(p, "#bundle", 7) == 0);
	p += 16;
	len -= 16;
	while (len) {
		unsigned n = getbe32(p);
		assert(n + 4 <= len);
		struct oscmsg msg = {.buf=(unsigned char *)p + 4, .end=(unsigned char *)p + 4 + n};
		char *addr = oscgetstr(&msg);
		char *types = oscgetstr(&msg);
		assert(addr && types);
		if (strcmp(types, ",fi") == 0) {
			msg.type = types + 1;
			reported = oscgetfloat(&msg);
			snprintf(reported_addr, sizeof reported_addr, "%s", addr);
		}
		++messages;
		p += n + 4;
		len -= n + 4;
	}
}
