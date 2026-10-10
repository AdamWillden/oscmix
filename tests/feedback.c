#include "mixer-harness.h"

static void
feedback(int reg, int raw)
{
	char addr[128];
	struct context ctx = {.reg=reg, .param={-1,-1}, .addr=addr, .addrend=addr + sizeof addr};
	assert(device->regtoctl(reg, &ctx.param) == MIX);
	unsigned before = writes;
	newmix(&ctx, raw);
	oscflush();
	assert(writes == before);
}

int
main(void)
{
	assert(init("ffufxii") == 0);
	outputs[8].stereo = outputs[9].stereo = true;
	unsigned before;
	struct node n = {.ctl=REFRESH};
	struct context ctx = {.node=&n, .param={-1,-1}};
	setrefresh(&ctx, NULL);
	assert(writes == 2 && lastreg == 0x3e05 && lastval == 0x3481);
	setmixlevel(inputs, outputs + 8, 1.f);
	assert(lastreg == 0x4004 && lastval == 0);
	setmixlevel(inputs, outputs + 8, powf(10.f, -.5f));
	assert(lastreg == 0x4004 && lastval == 0x1f9c);
	feedback(0x4004, 0x2000);
	assert(reported == 0 && strcmp(reported_addr, "/mix/9/input/1") == 0);
	feedback(0x4004, 0xa000);
	assert(reported == 0 && strcmp(reported_addr, "/mix/10/input/1") == 0);
	outputs[8].stereo = outputs[9].stereo = false;
	feedback(0x4004, 0xbf9c);
	assert(fabsf(reported + 10) < .001f && strcmp(reported_addr, "/mix/10/input/1") == 0);
	before = messages;
	feedback(0x4004, 0x4000);
	assert(messages == before);
	struct param p = {.in=30, .out=8};
	assert(device->regtoctl(0x4784, &p) == (enum control)-1);
	assert(device->regtoctl(0x0b40, &p) == (enum control)-1);
	for (int i = 0; i < 60; ++i) {
		for (int o = 0; o < 30; ++o) {
			p = (struct param){i, o};
			assert(device->ctltoreg(MIX_LEVEL, &p) == 0x4000 + i * 64 + o / 2);
		}
	}
	puts("Input feedback and refresh checks passed");
	return 0;
}
