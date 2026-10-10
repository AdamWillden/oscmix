#include "mixer-harness.h"

static void
route(const char *path, const char *types, float db, int pan)
{
	unsigned char buf[128];
	struct oscmsg msg = {.buf=buf, .end=buf + sizeof buf};
	oscputstr(&msg, path);
	oscputstr(&msg, types);
	if (types[1] != 'N')
		oscputfloat(&msg, db);
	if (strchr(types, 'i'))
		oscputint(&msg, pan);
	handleosc(buf, msg.buf - buf);
	oscflush();
}

int
main(void)
{
	assert(init("ffufxii") == 0);
	outputs[8].stereo = outputs[9].stereo = true;
	route("/mix/9/playback/1", ",fi", 0, 0);
	assert(writes == 1 && lastreg == 0x4784 && lastval == 0);
	assert(reported == 0);
	route("/mix/10/playback/2", ",fi", -10, 0);
	assert(writes == 2 && lastreg == 0x4784 && lastval == 0x1f9c);
	assert(fabsf(reported + 10) < .001f);
	route("/mix/9/playback/1", ",Ni", 0, 0);
	assert(writes == 3 && lastval == 0x1f9c);
	unsigned before = writes;
	route("/mix/9/playback/1", ",fi", -20, 25);
	assert(writes == before && fabsf(reported + 10) < .001f);
	route("/mix/9/playback/3", ",Ni", 0, 0);
	assert(writes == before); /* unknown is not an invented mute */
	muteinput(inputs + 30, true);
	assert(writes == before + 1 && lastval == 0x1448);
	before = writes;
	route("/mix/9/playback/1", ",fi", -20, 0);
	assert(writes == before + 1 && lastval == 0x1448);
	muteinput(inputs + 30, false);
	assert(writes == before + 2 && lastval == 0x1f38);
	/* Refresh sends only the two established refresh commands, then cache. */
	struct node n = {.ctl=REFRESH};
	struct context ctx = {.node=&n, .param={-1,-1}};
	before = writes;
	setrefresh(&ctx, NULL);
	assert(writes == before + 2 && lastreg == 0x3e05 && lastval == 0x3481);
	assert(fabsf(reported + 20) < .001f);
	puts("Playback routing, mute and cache checks passed");
	return 0;
}
